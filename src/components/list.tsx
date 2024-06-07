import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fetchVotingInfo = async (votingSlug: string) => {
  const response = await fetch(
    `https://play.talentprotocol.com/api/v1/votings/${votingSlug}`,
    {
      cache: "no-store",
    }
  );
  const data = await response.json();
  return data.voting;
};

const fetchTop100Candidates = async (votingSlug: string) => {
  const response = await fetch(
    `https://play.talentprotocol.com/api/v1/votings/${votingSlug}/candidates_leaderboard/?per_page=100`,
    {
      cache: "no-store",
    }
  );
  const data = await response.json();
  return data.leaderboard.results;
};

const List = async () => {
  // voting slug
  const votingSlug = "eth-cc";

  const [votingInfo, candidatesUnsorted] = await Promise.all([
    fetchVotingInfo(votingSlug),
    fetchTop100Candidates(votingSlug),
  ]);
  const candidates = candidatesUnsorted.sort(
    (a: any, b: any) => b.score - a.score
  );
  // this voting has max of 10 winners
  const maxWinners = votingInfo.winners_count;

  const isUrbe = (username: string) => {
    // talent protocol usernames of urbe team members in this voting
    const urbeUsernames = ["blackiconeth", "soliditydrone", "deca12x"];
    return username && urbeUsernames.includes(username);
  };

  const prizePool = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "code",
  })
    .format(parseFloat(votingInfo.prize_pool || 0))
    .replace("USD", "")
    .trim();

  const nowDate = new Date();
  const endDate = new Date(votingInfo.voting_end_date);
  const timeDiff = Math.abs(endDate.getTime() - nowDate.getTime()) / 36e5;
  const endDateString = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });
  return (
    <div>
      <h1 className="text-3xl font-bold">
        {votingInfo.name} by Talent Protocol
      </h1>
      <div className="mt-4 flex justify-between">
        <div>
          <h1 className="text-xl font-bold">End Voting</h1>
          <p>{endDateString}</p>
        </div>
        <div>
          <h1 className="text-xl font-bold">Time Left</h1>
          <p>{timeDiff.toFixed(2)} hours</p>
        </div>
      </div>
      <div className="flex w-full justify-between my-10">
        <div>
          <h1 className="text-xl font-bold">Candidates</h1>
          <p>{candidates.length ?? votingInfo.candidates_count}</p>
        </div>
        <div>
          <h1 className="text-xl font-bold">Prize Pool</h1>
          <p>{prizePool} $TALENT</p>
        </div>

        <div>
          <h1 className="text-xl font-bold">Votes</h1>
          <p>{votingInfo.vote_count}</p>
        </div>
      </div>
      <ol className="flex flex-col gap-2">
        <li className="flex gap-4 px-2 items-center justify-between">
          <b>Pos</b>
          <b>Votes</b>
          <b>Candidate</b>
          <b>Vote</b>
        </li>
        {candidates.map((candidate: any, index: number) => (
          <li
            key={candidate.name}
            className={`p-2 ${
              index === maxWinners - 1 ? " border-white border-b-4" : ""
            }`}
          >
            <div
              className={`flex gap-4 px-2 items-center justify-between
          ${isUrbe(candidate.username) ? "border-pink-400 border-4" : ""}
          `}
            >
              <div className="flex gap-1 items-center">#{index + 1}</div>
              <div className="flex gap-1 items-center">
                <b>{candidate.score}</b>
                Votes
              </div>
              <div className="flex gap-1 items-center">
                <Image
                  src={candidate.profile_picture_url ?? ""}
                  alt={candidate.name}
                  width={32}
                  height={32}
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <b>{candidate.name.slice(0, 21)}</b>
                  <span className="text-slate-400">@{candidate.username}</span>
                </div>
              </div>
              <button className="bg-violet-300 rounded-xl px-5 py-0 h-[40px]">
                <a
                  className="text-white font-bold my-0 py-0"
                  target="_blank"
                  href={`https://play.talentprotocol.com/votings/eth-cc?open_voting_modal=true&name=${candidate.username}`}
                >
                  Vote
                </a>
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default List;
