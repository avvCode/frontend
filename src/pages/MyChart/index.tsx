import {listChartByPageUsingPOST} from '@/services/bi/chartController';
import React, {useEffect, useState} from 'react';
import {message} from 'antd';


const MyChart: React.FC = () => {

  const initSearchParams = {
    pageSize: 12,
  }
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})
  const [chartList, setChartList] = useState<API.Chart[]>()
  const [total, setTotal] = useState<number>(0)
  const loadData = async () => {
    try {
      const res = await listChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? [])
        setTotal(res.data.total ?? 0)
      } else {
        message.error('获取我的图表失败')
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message)
    }

  }

  useEffect(() => {
    loadData()
  }, [searchParams])

  return (
    <div className="my-chart">
      数据列表,
      {
        JSON.stringify(chartList)

      }
      <br/>
      总数：{total}
    </div>
  );
};
export default MyChart;
