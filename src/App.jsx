import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ethers } from "ethers";

import config from "./config.json";

import { EthersContext } from "./context/EthersContext";
import { ExchangeContext } from "./context/ExchangeContext";
import { TokensContext } from "./context/TokensContext";

import { loadConnection, loadTokens, loadExchange } from "./app/interactions";

import useMetaMask from "./hooks/useMetaMask";

import "./App.css";

const App = () => {
	const dispatch = useDispatch();

	const [provider, setProvider] = useState({});
	const [exchange, setExchange] = useState({});
	const [tokens, setTokens] = useState({});

	const loadBlockchainData = async () => {
		// the term "provider" in this case is our connection to the blockchain
		const provider = new ethers.providers.Web3Provider(useMetaMask());
		setProvider(provider);

		// load connections & save the current connection information in the store
		const { chainId } = await loadConnection(provider, dispatch);

		// Load all tokens contracts
		const tokensConfig = [config[chainId]][0];
		const { SPEC, mETH, mDAI, mUSDT } = await loadTokens(provider, tokensConfig, dispatch);

		// Save the contracts of all tokens in state & make it globally accessible across the entire app using context
		setTokens({
			SPEC: { symbol: "SPEC", contract: SPEC },
			mETH: { symbol: "mETH", contract: mETH },
			mDAI: { symbol: "mDAI", contract: mDAI },
			mTether: { symbol: "mUSDT", contract: mUSDT },
		});

		// Get the Spectre exchange contract
		const exchangeConfig = config[chainId].spectre;
		const exchange = await loadExchange(provider, exchangeConfig.address);
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
					<main>
						<h1>Hello, World!</h1>
					</main>
				</TokensContext.Provider>
			</ExchangeContext.Provider>
		</EthersContext.Provider>
	);
};

export default App;
