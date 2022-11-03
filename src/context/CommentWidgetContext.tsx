import {createContext, Dispatch, useContext, useReducer} from "react";

export interface CommentWidgetState {
    siteName: string,
    pageId: string,
    needRefresh?: boolean,
}

const initialState: CommentWidgetState = {
    pageId: "", siteName: "", needRefresh: false,
}

const CommentWidgetContext = createContext<{
    commentWidgetState: CommentWidgetState,
    commentWidgetDispatch: Dispatch<CommentWidgetState>
}>({
    commentWidgetState: initialState,
    commentWidgetDispatch: () => null,
});

export function useCommentWidgetContext() {
    return useContext(CommentWidgetContext);
}

export const CommentWidgetContextProvider = ({children}: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer((state: CommentWidgetState, newState: Partial<CommentWidgetState>) => ({
        ...state, ...newState
    }), initialState);
    return (
        <CommentWidgetContext.Provider
            value={{
                commentWidgetState: state,
                commentWidgetDispatch: dispatch
            }}>{children}</CommentWidgetContext.Provider>
    );
}
