import {
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  Text,
  Title,
} from ' /styled-antd';
import { db } from ' /app/indexDB';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import Result from './result';
import BackTestResultType from ' /app/indexDB/backtest-result';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// const formatCurrencyOption = {
//   style: 'currency',
//   currency: 'USD',
// } as FormatNumberOptions;

// const formatPercentOption = {
//   style: 'percent',
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// } as FormatNumberOptions;

const BackTestResultPanel = ({
  backTestResult,
  index,
}: {
  backTestResult: BackTestResultType;
  index: number;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Flex gap="small" key={backTestResult.id} justify="space-between">
      <Flex gap="middle" align="center">
        <Title level={4}>{index + 1}.</Title>
        <Flex vertical>
          <Flex align="center" gap="small">
            {
              // eslint-disable-next-line no-nested-ternary
              editMode ? (
                <Input
                  size="small"
                  value={backTestResult.name}
                  onChange={(e) => {
                    db.backtestResult.update(backTestResult.id, {
                      name: e.target.value,
                    });
                  }}
                  onPressEnter={() => {
                    setEditMode(false);
                  }}
                />
              ) : (
                <Title level={5}>{backTestResult.name}</Title>
              )
            }
            {
              // eslint-disable-next-line no-nested-ternary
              editMode ? (
                <Button
                  type="text"
                  style={{
                    width: '24px',
                    height: '24px',
                    padding: 0,
                  }}
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  <CheckOutlined />
                </Button>
              ) : (
                <Button
                  type="text"
                  style={{
                    width: '24px',
                    height: '24px',
                    padding: 0,
                  }}
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  <EditOutlined />
                </Button>
              )
            }
          </Flex>
          <Text
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Run at {backTestResult.createdAt}
          </Text>
        </Flex>
      </Flex>
      <Flex align="center" gap="small">
        <Button
          onClick={() => {
            setModalOpen(true);
          }}
        >
          View
        </Button>
        <Button
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
          }}
          onClick={() => {
            db.backtestResult.delete(backTestResult.id);
          }}
        >
          <DeleteOutlined />
        </Button>
      </Flex>
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={backTestResult?.name}
        footer={null}
        style={{
          top: 20,
          bottom: 20,
          height: 'calc(100% - 40px)',
          overflow: 'auto',
          background: '#17171c',
        }}
      >
        {backTestResult && modalOpen && (
          <Result backTestResult={backTestResult} index={index} />
        )}
      </Modal>
    </Flex>
  );
};

const BackTestResult = () => {
  const backTestResults = useLiveQuery(() => db.backtestResult.toArray());

  console.log(backTestResults);
  return (
    <Flex
      vertical
      gap="small"
      flex="1"
      style={{
        padding: '8px',
        background: '#17171c',
      }}
    >
      <Title level={4}>Back Test Result</Title>
      <Divider />
      {backTestResults?.map((backTestResult, index) => {
        return (
          <BackTestResultPanel
            key={index}
            backTestResult={backTestResult}
            index={index}
          />
        );
      })}
    </Flex>
  );
};

export default BackTestResult;
