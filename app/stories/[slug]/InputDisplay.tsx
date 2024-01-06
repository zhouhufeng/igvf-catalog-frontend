import classNames from "classnames";

import { Input, UserStory } from "../content";

export default function InputDisplay({
    step,
    value,
    open,
    idx,
    lastIdx,
    onChange,
    setStep,
}: {
    step: UserStory<any>['steps'][0];
    value: any;
    open: boolean;
    idx: number;
    lastIdx: number;
    onChange: (key: string, value: any) => void;
    setStep: (step: number) => void;
}) {

    const handleChange = (val: any) => {
        if (step.inputType.type === 'float') {
            val = parseFloat(val);
        }

        onChange(step.key as string, val);
    }

    return (
        <div className={classNames(
            "px-2 pt-2",
            { "border-t border-black": idx !== 0 }
        )}>
            <h4 className="text-xl">{step.title}</h4>
            <div>
                <p className="pb-1">{step.description}</p>
                {(() => {
                    switch (step.inputType.type) {
                        case 'string': {
                            return (
                                <input
                                    type="text"
                                    value={value}
                                    onChange={e => handleChange(e.target.value)}
                                    className="border border-black rounded-lg p-1"
                                />
                            )
                        }
                        case 'float': {
                            return (
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={value}
                                    onChange={e => handleChange(e.target.value)}
                                    className="border border-black rounded-lg p-1"
                                />
                            )
                        }
                        case 'select': {
                            return (
                                <select
                                    value={value || ""}
                                    onChange={e => handleChange(e.target.value)}
                                >
                                    <option value="" disabled>Select an option...</option>
                                    {step.inputType.options.map(option => (
                                        <option key={option.key} value={option.key}>{option.name}</option>
                                    ))}
                                </select>
                            )
                        }
                        default: return null;
                    }
                })()}
            </div>
        </div>
    );
}
