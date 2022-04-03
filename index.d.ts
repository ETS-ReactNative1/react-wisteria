import { PropsWithoutRef, ComponentType } from 'react';

type useStateToPropsType = (ownProps?: PropsWithoutRef<any>) => Object;

type StateUpdater = (path: string, value: any) => void;

type MultipleStoreStateUpdater = (pairs: Array<Array<any>>) => void;

interface IWisteriaStoreConfig {
    name: String,
    initialState: any,
    effects: Array<Function>,
    initialPropsMapper: (state: any) => any
}

type IWisteriaStore = any;

declare module 'react-wisteria' {
    export const connect: (useStateToProps: useStateToPropsType) => (component: ComponentType) => ComponentType;
    export const useCreateStores: (storesConfig: IWisteriaStoreConfig[]) => IWisteriaStore[];
    export const StoreProvider: ComponentType<{ stores: IWisteriaStore[] }>;
    export const useWisteriaStore: (name: String) => IWisteriaStore;
    export const useWisteriaStateUpdater: (store: IWisteriaStore) => StateUpdater;
    export const useWisteriaStateSlice: (store: IWisteriaStore, path: String) => any;
    export const useWisteriaBatchUpdater: () => MultipleStoreStateUpdater
}
