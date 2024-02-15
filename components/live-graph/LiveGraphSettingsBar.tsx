"use client";

import { useAppSelector } from "@/app/_redux/hooks";
import { selectLiveGraphSettings, setLiveGraphSettings } from "@/app/_redux/slices/settingsSlice";
import { useDispatch } from "react-redux";

export default function LiveGraphSettingsBar() {
    const settings = useAppSelector(selectLiveGraphSettings);
    const dispatch = useDispatch();

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLiveGraphSettings({ loadDepth: parseInt(e.target.value) }));
    }

    return (
        <div className="flex flex-row justify-end flex-1 space-x-4">
            <label className="flex flex-col">
                <span>Graph Load Depth</span>
                <select value={settings.loadDepth} onChange={handleSelectChange}>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
            </label>
            <label className="flex flex-col">
                <span>Cluster Strategy (unimplemented)</span>
                <select>
                    <option>Unclustered</option>
                    <option>Cluster by Root Node Type</option>
                    <option>Cluster by Connection Density</option>
                </select>
            </label>
        </div>
    )
}
