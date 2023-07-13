import {genChartByAiAsyncUsingPOST} from "@/services/bi/chartController";
import React, {useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, message, Select, Space, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {useForm} from "antd/es/form/Form";



const AddChartAsync: React.FC = () => {

  const [form] = useForm()
  const [submitting, setSubmitting] = useState<boolean>(false)


  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    if (submitting) {
      return
    }
    //初始化一下
    setSubmitting(true)

    //此处处理提交操作，调用后端接口
    const params = {
      ...values,
      file: undefined
    }


    try {
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj)
      if (!res?.data) {
        message.success('分析失败')
      } else {
        message.success('分析成功提交成功，请稍后在我的图表页面查看')
        form.resetFields()
      }
    } catch (e: any) {
      message.error('分析失败,' + e.message)
    }
    setSubmitting(false)
  };
  return (
    <div className="add-chart-async">
          <Card title="智能分析">
            <Form
              form={form}
              name="addChart"
              onFinish={onFinish}
              initialValues={{}}
              labelAlign="left"
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}
            >
              <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标'}]}>
                <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况"/>
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <Input placeholder="请输入图表名称"/>
              </Form.Item>
              <Form.Item
                name="chartType"
                label="图表类型"
              >
                <Select placeholder="图表类型"

                        options={[
                          {value: '折线图', label: '折线图'},
                          {value: '柱状图', label: '柱状图'},
                          {value: '堆叠图', label: '堆叠图'},
                          {value: '饼图', label: '饼图'},
                          {value: '雷达图', label: '雷达图'},
                        ]}
                >
                </Select>
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"

              >
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传CSV文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 12, offset: 4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
    </div>
  );
};
export default AddChartAsync;
