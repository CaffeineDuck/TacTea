import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Home - TacTea</title>
        <meta
          name="description"
          content="TacTac with Tea => TacTea. Decentralized Tic-Tac-Toe game on Solana."
        />
      </Head>
      <div className="md:hero mx-auto p-4">
        <div className="md:hero-content flex flex-col my-56">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
            TacTea
          </h1>
          {/* description */}
          <p className="text-center text-2xl bg-clip-text text-blue-300">
            TacTic with Tea =&gt; TacTea
          </p>

          {/* buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
            <button className="btn btn-primary btn-lg text-white-600">
              <Link href="/create">Create Game</Link>
            </button>
            <button className="btn btn-primary btn-lg text-white-600">
              <Link href="/join">Join Game</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
