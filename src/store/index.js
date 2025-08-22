import create from "zustand";
import produce from "immer";
import { PLAY_STATUS, VIEW_MODES } from "../constants";

const useStore = create((set) => ({
    dragInfo: {
        isDragging: false,
    },
    setDragInfo: (payload) =>
        set(
            produce((state) => {
                state.dragInfo = payload;
            })
        ),

    showSaving: false,
    setShowSaving: (payload) =>
        set(
            produce((state) => {
                state.showSaving = payload;
            })
        ),

    showLoading: true,
    setShowLoading: (payload) =>
        set(
            produce((state) => {
                state.showLoading = payload;
            })
        ),

    curHistory: null,
    setCurHistory: (payload) =>
        set(
            produce((state) => {
                state.curHistory = payload;
            })
        ),

    dancerArray: [],
    setDancerArray: (payload) =>
        set(
            produce((state) => {
                state.dancerArray = payload;
            })
        ),

    currentFrameId: Date.now(),
    setCurrentFrameId: (payload) =>
        set(
            produce((state) => {
                state.currentFrameId = payload;
            })
        ),

    framesArray: [
        {
            id: Date.now(),
            timestamp: new Date(),
            dancerPositions: [],
            startTime: 0,
        },
    ],
    setFramesArray: (payload) =>
        set(
            produce((state) => {
                state.framesArray = payload;
            })
        ),

    defaultTransitionTime: 0,
    setDefaultTransitionTime: (payload) =>
        set(
            produce((state) => {
                state.defaultTransitionTime = payload;
            })
        ),

    playStatus: PLAY_STATUS.NORMAL,
    setPlayStatus: (payload) =>
        set(
            produce((state) => {
                state.playStatus = payload;
            })
        ),

    viewMode: VIEW_MODES.SELECT,
    setViewMode: (payload) =>
        set(
            produce((state) => {
                state.viewMode = payload;
            })
        ),

    currentDialog: null,
    setCurrentDialog: (payload) =>
        set(
            produce((state) => {
                state.currentDialog = payload;
            })
        ),

    musicArray: [],
    setMusicArray: (payload) =>
        set(
            produce((state) => {
                state.musicArray = payload;
            })
        ),
    updateSingleMusic: (payload) =>
        set(
            produce((state) => {
                const index = state.musicArray.findIndex(
                    (item) => item.id === payload.id
                );

                state.musicArray[index] = payload;
            })
        ),

    selectedVideo: null,
    setSelectedVideo: (payload) =>
        set(
            produce((state) => {
                state.selectedVideo = payload;
            })
        ),

    selectedMusic: null,
    setSelectedMusic: (payload) =>
        set(
            produce((state) => {
                state.selectedMusic = payload;
            })
        ),

    contextMenuInfo: {
        isOpen: false,
        x: -1000,
        y: -1000,
    },

    setContextMenuInfo: (payload) =>
        set(
            produce((state) => {
                state.contextMenuInfo = payload;
            })
        ),

    indicatorPos: 0,
    setIndicatorPos: (payload) =>
        set(
            produce((state) => {
                state.indicatorPos = payload;
            })
        ),

    addIndicatorPos: (payload) =>
        set(
            produce((state) => {
                state.indicatorPos += payload;
            })
        ),
}));

export default useStore;
