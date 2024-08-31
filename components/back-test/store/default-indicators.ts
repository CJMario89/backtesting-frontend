export const defaultAllIndicators = [
  {
    name: 'RSI',
    isBase: true,
    indicators: [
      {
        displayName: 'RSI 14 ',
        name: 'RSI',
        params: {
          period: '14',
          max: 100,
          min: 0,
          isPriceRelated: false,
        },
        id: 'e7b687ff-5a80-40ea-bff0-35f5bfbc1e13',
        baseId: '0afdec9e-680f-4407-bbd0-4db99d42db19',
        isShowInChart: true,
        color: '#ffaa50',
      },
    ],
  },
  {
    name: 'MACD',
    isBase: true,
    multiResult: {
      histogram: true,
      macd: true,
      signal: true,
    },
    indicators: [
      {
        displayName: 'MACD',
        name: 'MACD',
        params: {
          short: '12',
          long: '26',
          signal: '9',
          max: 9007199254740991,
          min: -9007199254740991,
          isValueFixed: true,
          isPriceRelated: false,
        },
        id: 'cf55e085-b3d2-406f-b9b8-12614b336dc5',
        baseId: '3a1c316d-0e22-4654-ac0a-0422a393ae0b',
        isShowInChart: true,
        color: '#ffaa50',
        isColorFixed: true,
      },
    ],
  },
];
