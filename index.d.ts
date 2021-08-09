declare module 'react-wisteria' {
    export const Provider: IProvider;

    export const connect: IConnect;

    interface IOptions {
        /** React Context that will be build based on the Root Component props */
        Context: React.Context<{}>,
        /**
         * a mapper function to construct the state shape based on the Root Component props
         */
        initialPropsMapper?: (Object) => Object,
        /**
         * All the hooks for the state
         */
         hooks?: []
    }

    type IProvider = (options: IOptions) => (Component: React.Component | React.FunctionComponent) => React.FunctionComponent;

    type IConnect = (useStateToProps: (state: Object) => Object) => (Component: React.Component | React.FunctionComponent) => React.FunctionComponent;
}
