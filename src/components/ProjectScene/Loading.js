import { Spinner } from "react-bootstrap";

export const Loading = () => {
    return (
        <div className="loadingDiv">
            <Spinner animation="border" variant="primary">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    );
};

export default Loading;
