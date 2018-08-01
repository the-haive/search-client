// /**
//  * This abstract class ensures that the passed version and path is parsed and set correctly.
//  */
// export abstract class VersionPathSettings {

//     /**
//      * The version of the back-end rest-service.
//      * The currently supported versions are 2, 3 and 4.
//      */
//     public version: number = 4;

//     /**
//      * You can use this path to override the path to the rest-service.
//      * If not set, it will default to "RestService/v" and whatever `this.version` is set to.
//      * If it is set it will use the set path verbatim, without appending `this.version`.
//      */
//     public path: string = 'RestService/v';

//     /**
//      * Resolves version and path to sensible values.
//      *
//      * @param settings These are the settings related to the Version-path resolution logic.
//      */
//     constructor(settings?: VersionPathSettings) {
//         if (settings) {
//             this.version = typeof settings.version !== 'undefined' ? settings.version : this.version;
//             this.path = typeof settings.path  !== 'undefined' ? settings.path : (this.path + this.version);
//         } else {
//             // If no settings are defined we default to appending the version onto the default path.
//             this.path += this.version;
//         }

//         if (!this.version || this.version < 2 || this.version > 4) {
//             throw new Error('Only supports version 2, 3 and 4.');
//         }

//         // Remove leading and trailing slashes
//         this.path = this.path.replace(/(^\/+)|(\/+$)/g, '');
//     }
// }
