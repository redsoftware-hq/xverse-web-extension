import axios from 'axios';
import { useEffect, useState } from 'react';

const useMarketData = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<null | Error>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical', {
                    headers: {
                        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
                    },
                    params: {
                        symbol: 'BTC,WBTC',
                        convert: 'USD',
                        count: 108,
                        interval: '5m'

                    }
                });
                setData(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();

        // Set up interval to fetch data every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000);

        // Clean up interval on unmount
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    return { data, error, loading };
};

export default useMarketData;
