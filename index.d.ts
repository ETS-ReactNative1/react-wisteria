declare module 'react-wisteria' {

    const reactWisteria: ReactWisteriaAPI;

    export default reactWisteria;

    type IProviderResponse = (component: React.Component) => React.Component;

    interface IOptions {
        /** React Context that will be build based on the Root Component props */
        Context: React.Context<{}>,
        /**
         * a mapper function to construct the state shape based on the Root Component props
         */
        initialPropsMapper?: Function,
        /**
         * Derived state syncers
         */
        derivedStateSyncers?: [],
        /**
         * All the effects for the state
         */
        effects?: []
    }

    interface ReactWisteriaAPI {
        (options: IOptions): IProviderResponse
    }
}
