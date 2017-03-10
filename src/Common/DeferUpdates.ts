/**
 * Decides on how updates are to be handled for the components as they are triggered.
 */
export enum DeferUpdates {
    /**
     * Updates are executed immediately
     */
    No, 

    /**
     * Defer execution until state changes to No.
     */
    Yes,

    /**
     * Turn Off execution of updates. If state was Defer and there are pending updates then these will be ignored and cleared.
     */
    Off,
}
