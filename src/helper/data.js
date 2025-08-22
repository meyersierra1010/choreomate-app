export const getCurrentFrameIndex = (currentFrameId, framesArray) => {
    const index = framesArray.findIndex((item) => item.id === currentFrameId);
    return index;
};

export const getCurrentFrameData = (currentFrameId, framesArray) => {
    const result = framesArray.find((item) => item.id === currentFrameId);
    return { ...result };
};

export const getCurrentVideoData = (
    currentFrameId,
    framesArray,
    dancerArray
) => {
    const curFrame = getCurrentFrameData(currentFrameId, framesArray);

    if (!curFrame || !curFrame.dancerPositions) {
        return [];
    }

    const result = curFrame.dancerPositions.map((item) => {
        const dancerId = item.id;
        const dancer = dancerArray.find((item) => item.id === dancerId);
        return {
            id: item.id,
            position: item.position,
            video: dancer.video,
        };
    });

    return result;
};
