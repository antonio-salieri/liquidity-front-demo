import CreatePoolModal from "../components/modal/CreatePoolModal";
import CoinImgShower from "../elements/CoinImageShower"
import { Component } from "react";
import styled from "styled-components";

class PoolList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			poolsData: this.props.poolsData,
			isModal: false,
			isLoading: false,
		};
	}

	componentDidMount() {
		if (this.props.poolsData !== null) {
			this.setState({ poolsData: this.props.poolsData, isLoading: true })
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.poolsData !== this.props.poolsData) {
			this.setState({ poolsData: this.props.poolsData, isLoading: true })
		}
	}

	modalHandler = () => {
		this.setState({ isModal: !this.state.isModal });
	};

	getPoolPairs(item) {
		return [
			item.liquidity_pool.reserve_coin_denoms[0].substr(1).toUpperCase(),
			item.liquidity_pool.reserve_coin_denoms[1].substr(1).toUpperCase()
		];
	}

	getSecondPairPrice(item) {
		const price = Number(item.liquidity_pool_metadata.reserve_coins[1]?.amount) / Number(item.liquidity_pool_metadata.reserve_coins[0]?.amount);
		return Number(price).toFixed(2);
	}

	createRows(data) {
		if (!this.state.isLoading) {
			return
		}
		if (data === null || data === undefined) {
			return (
				<div
					style={{ color: "#ea5353", fontSize: "18px", fontWeight: "bold" }}
				>There are no pools to display yet.<br />
			Be the first to create a pool!
				</div>
			);
		} else {
			return data.map((item, index) => {
				const pairs = this.getPoolPairs(item);
				const secondPairPrice = this.getSecondPairPrice(item);
				return (
					<Row key={index}>
						<div><CoinImgShower coin={pairs[0]} />{pairs[0]} - <CoinImgShower coin={pairs[1]} />{pairs[1]}</div>
						<div>
							{`1 ${pairs[0]} per`}
							<br />
							{`${secondPairPrice} ${pairs[1]}`}
						</div>
					</Row>
				);
			});
		}
	}

	render() {
		return (
			<>
				<GoCreatePool onClick={this.modalHandler}>Create Pool</GoCreatePool>
				<PoolTable>
					<TableHeader>
						<div>Pool</div>
						<div>Price</div>
					</TableHeader>
					{this.createRows(this.state.poolsData)}
				</PoolTable>
				{this.state.isModal ? (
					<CreatePoolModal modalHandler={this.modalHandler} />
				) : (
						""
					)}
			</>
		);
	}
}

const GoCreatePool = styled.button`
	display: inline-block;
	text-decoration: none;
	color: #fff;
	background-color: #4297ff;
	height: 36px;
	width: 110px;
	line-height: 36px;
	border-radius: 40px;
	font-size: 14px;
	font-weight: bold;
	margin-bottom: 20px;
	margin-right: 70px;
	align-self: flex-end;
	border: none;
	outline: none;
	cursor: pointer;
	transition: opacity 0.3s;
    &:hover {
        opacity: 0.7;
    }
`;

const PoolTable = styled.section`
	margin: 0 auto;
	border-radius: 6px;
	text-align: center;
`;
const Row = styled.div`
	margin-bottom: 20px;
	display: flex;
	width: 540px;

	div {
		width: 50%;
		line-height: 24px;
	}

	div:first-child {
		line-height: 48px;
	}
`;
const TableHeader = styled(Row)`
	margin-bottom: 30px;
	background-color: #eef5ff;
	font-weight: bold;

	div {
		line-height: 48px;
	}
`;

export default PoolList;

//helper
// function setWallettokenDataToPoolListData(poolListData, walletTokens) {
//     let pd = [...poolListData]
//     const wt = walletTokens

//     pd.forEach((pool, index) => {
//         let poolTokenTotalSupply;
//         let myPoolTokenAmount;
//         let myPoolTokenRatio;

//         wt.some(isPoolToken)
//         pool.myPoolToken = {
//             balance: myPoolTokenRatio,
//             denom: '%'
//         }

//         pool.liquidity_pool.reserve_coin_denoms.forEach((denom, denomIndex) => {
//             wt.some(isReserveToken)

//             function isReserveToken(td) {
//                 if (td.denom === denom) {
//                     let reserveTokenAmount;

//                     for (let tokenInfo of pd[index].liquidity_pool_metadata.reserve_coins) {
//                         if (tokenInfo.denom === denom) {
//                             reserveTokenAmount = tokenInfo.amount
//                         }
//                     }

//                     pd[index].liquidity_pool.reserve_coin_denoms[denomIndex] = `${reserveTokenAmount / 1000000 * myPoolTokenRatio}${denom.substr(1)}`
//                     return true
//                 }
//             }
//         })

//         function isPoolToken(td) {
//             if (pool.liquidity_pool.pool_coin_denom === td.denom) {
//                 poolTokenTotalSupply = pool.liquidity_pool_metadata.pool_coin_total_supply.amount
//                 myPoolTokenAmount = td.amount
//                 myPoolTokenRatio = (myPoolTokenAmount / poolTokenTotalSupply)
//                 console.log(`
//                     PoolTokendenom : ${td.denom}
//                     myPoolTokenAmount : ${myPoolTokenAmount}
//                     poolTokenTotalSupply : ${poolTokenTotalSupply}
//                     ratio : ${myPoolTokenRatio}
//                     `)
//                 return true
//             }
//         }
//     });
