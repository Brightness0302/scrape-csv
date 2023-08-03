const LoadingSpinnerContainer = () => {
    return (
        <div className="loadingSpinnerContainer">
            <img
                src="/image/loading-forever.gif"
                className="loadingSpinner"
                alt="Loading..."
                draggable="false"
            />
        </div>
    );
};

export default LoadingSpinnerContainer;
