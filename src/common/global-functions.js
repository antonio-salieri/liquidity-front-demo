export function getTokenIndexer(wtl) {
    let tokenIndexer = {}
    if (wtl) {
        wtl.forEach((item) => {
            tokenIndexer[item.denom] = item.amount
        })
    }
    return tokenIndexer
}

export function getMyTokenBalance(token, indexer) {
    if (indexer === null) {
        return `My Balance: 0`
    } else {
        const balance = Number(Number(indexer[token]) / 1000000).toFixed(2)
        if (balance !== "NaN") {
            return `My Balance: ${balance}`
        } else {
            return `My Balance: 0`
        }
    }
}

export function sortReserveCoinDenoms(x, y) {
    return [x, y]
}

export function getDepositCoins(denoms, amounts) {
    return { denoms: [denoms[0], denoms[1]], amounts: [amounts[denoms[0]], amounts[denoms[1]]] }
}

export function calculateCounterPairAmount(e, state, slippage, type) {
    let price = null;
    let counterPairAmount = 0;
    let counterPair = ''
    let swapFeeRatio = 1

    console.log(slippage)

    if (type === 'swap') {
        swapFeeRatio = 0.997
    }

    if (e.target.id === "tokenAAmount") {
        price = state.tokenBPoolAmount / state.tokenAPoolAmount
        counterPair = "tokenBAmount"
        counterPairAmount = e.target.value * price
    } else {
        price = state.tokenAPoolAmount / state.tokenBPoolAmount
        counterPair = "tokenAAmount"
        counterPairAmount = e.target.value * price
    }
    counterPairAmount = (counterPairAmount * (1 - slippage) * swapFeeRatio)

    return {
        price: price,
        counterPair: counterPair,
        counterPairAmount: counterPairAmount,
    }
}

export function calculateSlippage(swapAmount, poolReserve) {
    return 2 * swapAmount / poolReserve
}
