export const LoadingSpinner = () => {
  return (
    <div role="status">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="m-auto block bg-none"
        width="200px"
        height="200px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M23 50A27 27 0 0 0 77 50A27 29.1 0 0 1 23 50"
          fill="#FFFFFF"
          stroke="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 51.05;360 50 51.05"
          ></animateTransform>
        </path>
      </svg>
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="bg-off-white flex min-h-screen justify-center pt-64">
      <LoadingSpinner />
    </div>
  );
};
