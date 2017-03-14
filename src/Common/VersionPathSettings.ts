export abstract class VersionPathSettings {

    /**
     * The version of the back-end rest-service.
     * The currently supported versions are 2 and 3.
     */
    public version?: number = 3;

    /**
     * You can use this path to override the path to the rest-service. 
     * The default is "RestService/v{version}".
     */
    public path?: string = "RestService/v";

    constructor(settings?: VersionPathSettings) {
        if (settings) {
            if (settings.version && (settings.version < 2 || settings.version > 3)) {
                throw new Error("Only supports version 2 and 3.");
            }
            settings.version = settings.version || this.version;
            settings.path  = settings.path || (this.path += settings.version);
        } else {
            this.path += this.version;
        }

        Object.assign(this, settings);
        
        // Remove leading and trailing slashes
        this.path.replace(/(^\/+)|(\/+$)/, "");
    }
}
