import {listChartByPageUsingPOST} from '@/services/bi/chartController';
import React, {useEffect, useState} from 'react';
import {Avatar, Card, List, message} from 'antd';
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";



const MyChart: React.FC = () => {

  const initSearchParams = {
    current:1,
    pageSize: 4,
  }
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})
  const [chartList, setChartList] = useState<API.Chart[]>()
  const [total, setTotal] = useState<number>(0)
  const { initialState } = useModel('@@initialState');
  const {currentUser} = initialState ?? {}
  const [loading,setLoading] = useState<boolean>(true)
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await listChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? [])
        setTotal(res.data.total ?? 0)

        //隐藏图表的title
        if(res.data.records){
          res.data.records.forEach(data =>{
            const chartOption = JSON.parse(data.genChart??'{}')
            chartOption.title = undefined
            data.genChart = JSON.stringify(chartOption)
          })
        }

      } else {
        message.error('获取我的图表失败')
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [searchParams])

  return (
    <div className="my-chart">
      <div>
        <Search placeholder="请输入图表名称" loading={loading} enterButton onSearch={(value)=>{
              setSearchParams({
                  ...initSearchParams,
                  name:value
                }
              )
            }
          }
        />

      </div>
      <div className="margin-16"/>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page,pageSize) => {
            setSearchParams({
              ...searchParams,
              current:page,
              pageSize,
            })
          },
          current:searchParams.current,
          pageSize: searchParams.pageSize,
          total:total
        }}
        dataSource={chartList}

        renderItem={(item) => (
          <List.Item
            key={item.id}
          >
            <Card style={{width:'100%'}}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? ('图表类型：' + item.chartType):undefined}
              />
              <div style={{marginBottom : 16}}/>
              <p>{'分析目标：' + item.goal}</p>
              <div style={{marginBottom : 16}}/>
              <ReactECharts option={JSON.parse(item.genChart ?? '{}')}/>
            </Card>
          </List.Item>
        )}
      />
      总数：{total}
    </div>
  );
};
export default MyChart;
