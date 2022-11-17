import { Account } from '@stores/wallet/actions/types';
import { fetchBtcTransactionsData, getConfirmedTransactions, getStacksInfo } from '@secretkeylabs/xverse-core/api';
import BigNumber from 'bignumber.js';
import { BtcAddressData, SettingsNetwork, StxTransactionListData } from '@secretkeylabs/xverse-core';

const validUrl = require('valid-url');

export function initBigNumber(num: string | number | BigNumber) {
  return BigNumber.isBigNumber(num) ? num : new BigNumber(num);
}

export function ftDecimals(value: number | string | BigNumber, decimals: number): string {
  const amount = initBigNumber(value);
  return amount.shiftedBy(-decimals).toNumber().toString();
}

export function replaceCommaByDot(amount: string) {
  return amount.replace(/,/g, '.');
}

export const microStxToStx = (mStx: number | string | BigNumber) => {
  const microStacks = initBigNumber(mStx);
  return microStacks.shiftedBy(-6);
};

/**
 * get ticker from name
 */
export function getTicker(name: string) {
  if (name.includes('-')) {
    const parts = name.split('-');
    if (parts.length >= 3) {
      return `${parts[0][0]}${parts[1][0]}${parts[2][0]}`;
    }
    return `${parts[0][0]}${parts[1][0]}${parts[1][1]}`;
  }
  if (name.length >= 3) {
    return `${name[0]}${name[1]}${name[2]}`;
  }
  return name;
}

export function getAddressDetail(account:Account) {
  if (account) {
    return `${account.btcAddress.substring(0, 4)}...${account.btcAddress.substring(
      account.btcAddress.length - 4,
      account.btcAddress.length,
    )} / ${account.stxAddress.substring(0, 4)}...${account.stxAddress.substring(
      account.stxAddress.length - 4,
      account.stxAddress.length,
    )}`;
  }
  return '';
}

export function getExplorerUrl(stxAddress: string): string {
  return `https://explorer.stacks.co/address/${stxAddress}?chain=mainnet`;
}

export function getFetchableUrl(uri: string, protocol: string): string | undefined {
  const publicIpfs = 'https://ipfs.io/ipfs';
  if (protocol === 'http') return uri;
  if (protocol === 'ipfs') {
    const url = uri.split('//');
    return `${publicIpfs}/${url[1]}`;
  }
  return undefined;
}

export async function isValidURL(str: string): Promise<boolean> {
  if (validUrl.isUri(str)) {
    const response = await getStacksInfo(str);
    if (response) {
      return true;
    }
  }
  return false;
}

export async function checkAccountActivity(
  stxAddress: string,
  btcAddress: string,
  selectedNetwork: SettingsNetwork,
) {
  const stxTxHistory: StxTransactionListData = await getConfirmedTransactions(
    {
      stxAddress,
      network: selectedNetwork,
    },
  );
  if (stxTxHistory.totalCount !== 0) return true;
  const btcTxHistory: BtcAddressData = await fetchBtcTransactionsData(
    btcAddress,
    selectedNetwork?.type,
  );
  return btcTxHistory.transactions.length !== 0;
}
