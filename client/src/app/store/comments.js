import { createAction, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested(state) {
            state.isLoading = true;
        },
        commentsReceived(state, action) {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed(state, action) {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentRemoved(state, action) {
            state.entities = state.entities.filter(
                (el) => el._id !== action.payload
            );
        },
        commentRemoveFailed(state, action) {
            state.error = action.payload;
        },
        commentCreated(state, action) {
            state.entities.push(action.payload);
        },
        commentCreateFailed(state, action) {
            state.error = action.payload;
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    commentRemoved,
    commentRemoveFailed,
    commentCreated,
    commentCreateFailed
} = actions;

const commentRemoveRequested = createAction("comments/RemoveRequested");
const commentCreateRequested = createAction("comments/CreateRequested");

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);

        dispatch(commentsReceived(content));
    } catch (error) {
        console.log(error);
        dispatch(commentsRequestFailed(error.message));
    }
};
export const removeComment = (id) => async (dispatch) => {
    dispatch(commentRemoveRequested());
    try {
        const { content } = await commentService.removeComment(id);
        if (!content) dispatch(commentRemoved(id));
    } catch (error) {
        dispatch(commentRemoveFailed(error.message));
    }
};
export const createComment = (data) => async (dispatch, getState) => {
    dispatch(commentCreateRequested());
    const comment = {
        ...data,
        userId: getState().users.auth.userId
    };
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentCreated(content));
    } catch (error) {
        dispatch(commentCreateFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
