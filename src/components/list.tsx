export const dynamic = "force-dynamic";

const List = async () => {
  // voting slug
  const votingSlug = "eth-cc";

  // this voting has max of 10 winners
  const maxWinners = 10;

  const response = await fetch(
    `https://play.talentprotocol.com/api/v1/votings/${votingSlug}/candidates_leaderboard/?per_page=100`
  );
  const data = await response.json();
  const candidates = data.leaderboard.results.sort(
    (a: any, b: any) => b.score - a.score
  );

  const isUrbe = (username: string) => {
    // talent protocol usernames of urbe team members
    const urbeUsernames = ["blackiconeth", "soliditydrone"];
    return username && urbeUsernames.includes(username);
  };

  return (
    <ol className="flex flex-col gap-4">
      <li className="flex gap-4">
        <b>Pos</b>
        <b>Votes</b>
        <b>Name</b>
      </li>
      {candidates.map((candidate: any, index: number) => (
        <li
          key={candidate.name}
          className={`flex gap-4 ${
            index === maxWinners - 1 ? "border-white border-b-4" : ""
          }
          ${isUrbe(candidate.username) ? "border-pink-400 border-4" : ""}
          `}
        >
          <div className="flex gap-1 items-center">#{index + 1}</div>
          <div className="flex gap-1 items-center">
            <b>{candidate.score}</b>
            Votes
          </div>
          <div className="flex gap-1 items-center">
            <img
              src={candidate.profile_picture_url ?? ""}
              alt={candidate.name}
              className="w-[32px] h-[32px] rounded-full object-cover"
            />
            {candidate.name}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default List;
