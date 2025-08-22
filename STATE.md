## Global state description

-   dragInfo: detect if user is dragging the dancer

-   dancerArray: array of dancers
    const newDancer = {
    id: Date.now(),
    video: HTML video element,
    }

-   currentFrameId: current Frame id

-   framesArray: array of frames
    {
    id: Date.now(),
    timestamp: new Date(),
    dancerPositions: []
    }

-   defaultTransitionTime: transition time setting
