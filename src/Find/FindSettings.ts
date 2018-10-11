import { BaseSettings, IBaseSettings } from "../Common";
import { FindTriggers } from "./FindTriggers";
import { IMatches } from "../Data";

export interface IFindSettings extends IBaseSettings<IMatches> {
    /**
     * The trigger-settings for when automatic match result-updates are to be triggered.
     */
    triggers?: FindTriggers;
}

/**
 * These are all the settings that can affect the returned categories for Find() lookups.
 */
export class FindSettings extends BaseSettings<IMatches> {
    /**
     * The trigger-settings for when automatic match result-updates are to be triggered.
     */
    public triggers: FindTriggers;

    /**
     * The endpoint to do Find lookups for. Default: "search/find"
     * Overrides base.
     */
    public servicePath: string;

    /**
     * Creates a FindSettings object for you, based on FindSettings defaults and the overrides provided as a param.
     * @param settings - The settings defined here will override the default FindSettings.
     */
    constructor(settings: IFindSettings | string) {
        super(); // dummy (using init instead)
        // Setup settings object before calling super.init with it.
        if (typeof settings === "string") {
            settings = { baseUrl: settings } as IFindSettings;
        }
        settings.servicePath =
            typeof settings.servicePath !== "undefined"
                ? settings.servicePath
                : "search/find";
        super.init(settings);

        // Setup our own stuff (props not in the base class).
        this.triggers = new FindTriggers(settings.triggers);
    }
}
