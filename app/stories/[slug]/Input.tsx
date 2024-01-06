import { Input, UserStory } from "../content";


export default function Input({
    step,
    onChange,
}: {
    step: UserStory<any>['steps'][0];
    onChange: (key: string, value: any) => void;
}) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = e.target.value;
        if (step.inputType.type === 'float') {
            value = parseFloat(value);
        }

        onChange(step.key as string, value);
    }

    return (
        <div>
            
        </div>
    );
}
