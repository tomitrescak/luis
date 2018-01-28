import { File } from "fuse-box";
import { WorkFlowContext, Plugin } from "fuse-box";

// import { AllowedExtenstions  } from 'fuse-box/core/PathMaster';
// AllowedExtenstions.list.add('.snap');

/**
 *
 *
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export class FuseBoxSnapshotPlugin implements Plugin {
    /**
     *
     *
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.snap$/
    /**
     *
     *
     * @param {WorkFlowContext} context
     *
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".snap");
    }
    /**
     *
     *
     * @param {File} file
     *
     * @memberOf FuseBoxHTMLPlugin
     */
    public transform(file: File) {
        const context = file.context;
        if (context.useCache) {
            if (file.loadFromCache()) {
                return;
            }
        }

        file.loadContents();
        // file.contents = `module.exports = ${file.contents || {}};`;
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
};

export const SnapshotPlugin = () => {
    return new FuseBoxSnapshotPlugin();
};