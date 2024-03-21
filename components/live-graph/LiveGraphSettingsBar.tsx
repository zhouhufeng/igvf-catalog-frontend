"use client";

import { useAppSelector } from "@/app/_redux/hooks";
import { ClusterStrategy, selectLiveGraphSettings, setLiveGraphSettings } from "@/app/_redux/slices/settingsSlice";
import { useDispatch } from "react-redux";
import { SizingType } from "reagraph";

export default function LiveGraphSettingsBar() {
    const settings = useAppSelector(selectLiveGraphSettings);
    const dispatch = useDispatch();

    const handleDepthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLiveGraphSettings({ loadDepth: parseInt(e.target.value) }));
    }

    const handleClusterStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLiveGraphSettings({ clusterStrategy: e.target.value as ClusterStrategy }));
    }

    const handleSizingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setLiveGraphSettings({ sizingType: e.target.value as SizingType }));
    }

    return (
        <div className="flex flex-row justify-end flex-1 space-x-4">
            <label className="flex flex-col">
                <span>Graph Load Depth</span>
                <select value={settings.loadDepth} onChange={handleDepthChange}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
            </label>
            <label className="flex flex-col">
                <span>Cluster Strategy</span>
                <select value={settings.clusterStrategy} onChange={handleClusterStrategyChange}>
                    <option value="unclustered">Unclustered</option>
                    <option value="rootNode">Cluster by Root Node Type</option>
                    <option value="density">Cluster by Connection Density</option>
                </select>
            </label>
            <label className="flex flex-col">
                <span>Sizing Strategy</span>
                <select value={settings.sizingType} onChange={handleSizingTypeChange}>
                    <option value="none">None</option>
                    <option value="centrality">Centrality</option>
                    <option value="pagerank">Page Rank</option>
                </select>
            </label>
        </div>
    )
}
