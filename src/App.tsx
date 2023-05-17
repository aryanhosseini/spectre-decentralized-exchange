import { useEffect, useState } from "react";
import { useAppDispatch } from "./app/hooks";

import { ethers } from "ethers";

import config from "./config.json";

import { EthersContext } from "./context/EthersContext";
import { ExchangeContext } from "./context/ExchangeContext";
import { TokensContext } from "./context/TokensContext";

import { loadConnection, loadTokens, loadExchange } from "./app/interactions";
import useMetaMask from "./hooks/useMetaMask";

import { Header } from "./components";

import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
	const dispatch = useAppDispatch();

	const [provider, setProvider] = useState({});
	const [exchange, setExchange] = useState({});
	const [tokens, setTokens] = useState<any>({});

	const loadBlockchainData = async () => {
		// the term "provider" in this case is our connection to the blockchain
		// eslint-disable-next-line
		const provider = new ethers.providers.Web3Provider(useMetaMask());
		setProvider(provider);

		// load connections & save the current connection information whenever the account has been changed
		useMetaMask().on("accountsChanged", async () => {
			await loadConnection(provider, dispatch);
		});

		// Load all tokens contracts
		const { SPEC, mETH, mDAI, mUSDT } = await loadTokens(provider, config, dispatch);

		// Save the contracts of all tokens in state & make it globally accessible across the entire app using context
		setTokens({
			SPEC: { symbol: "SPEC", contract: SPEC },
			mETH: { symbol: "mETH", contract: mETH },
			mDAI: { symbol: "mDAI", contract: mDAI },
			mTether: { symbol: "mUSDT", contract: mUSDT },
		});

		// Get the Spectre exchange contract
		const exchange = await loadExchange(provider, config.spectre.address);
		setExchange(exchange);
	};

	useEffect(() => {
		// When the exchange runs, it's gonna get all the Blockchain data and contracts
		loadBlockchainData();
	}, []);

	return (
		<EthersContext.Provider value={{ provider }}>
			<ExchangeContext.Provider value={{ exchange }}>
				<TokensContext.Provider value={{ tokens }}>
					<div className="container">
						<Header />
					</div>

					<Routes>
						<Route path="/" element={<Navigate to="/swap" />} />
						{/* <Route path="swap" element={<Swap />} /> */}
						{/* <Route path="trade" element={<Trade />} /> */}
					</Routes>
				</TokensContext.Provider>
			</ExchangeContext.Provider>
		</EthersContext.Provider>
	);
};

export default App;
