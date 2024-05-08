const SetUsernameView = ({ username, onChangeUsername, onSaveUsername, loading, error }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg text-center border-4 border-brown rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Set Your Username</h1>
        <input
          type="text"
          value={username}
          onChange={onChangeUsername}
          placeholder="Enter your username"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          onClick={onSaveUsername}
          disabled={loading || !username.trim()}
          className="w-full py-2 px-4 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        >
          Save Username
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default SetUsernameView;
