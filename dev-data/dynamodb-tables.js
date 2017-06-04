export default [{
  TableName: 'message',
  AttributeDefinitions: [{
    AttributeName: 'channelId',
    AttributeType: 'S'
  }, {
    AttributeName: 'timestamp',
    AttributeType: 'S'
  }],
  KeySchema: [{
    AttributeName: 'channelId',
    KeyType: 'HASH'
  }, {
    AttributeName: 'timestamp',
    KeyType: 'RANGE'
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}, {
  TableName: 'channel',
  AttributeDefinitions: [{
    AttributeName: 'id',
    AttributeType: 'S'
  }],
  KeySchema: [{
    AttributeName: 'id',
    KeyType: 'HASH'
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}, {
  TableName: 'subscription',
  AttributeDefinitions: [{
    AttributeName: 'userId',
    AttributeType: 'S'
  }, {
    AttributeName: 'channelId',
    AttributeType: 'S'
  }],
  KeySchema: [{
    AttributeName: 'userId',
    KeyType: 'HASH'
  }, {
    AttributeName: 'channelId',
    KeyType: 'RANGE'
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}, {
  TableName: 'user.identity',
  AttributeDefinitions: [{
    AttributeName: 'id',
    AttributeType: 'S'
  }, {
    AttributeName: 'email',
    AttributeType: 'S'
  }, {
    AttributeName: 'username',
    AttributeType: 'S'
  }, {
    AttributeName: 'permalink',
    AttributeType: 'S'
  }],
  KeySchema: [{
    AttributeName: 'id',
    KeyType: 'HASH'
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  GlobalSecondaryIndexes: [{
    IndexName: 'email-index',
    KeySchema: [{
      AttributeName: 'email',
      KeyType: 'HASH'
    }],
    Projection: {
      ProjectionType: 'ALL'
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }, {
    IndexName: 'username-index',
    KeySchema: [{
      AttributeName: 'username',
      KeyType: 'HASH'
    }],
    Projection: {
      ProjectionType: 'ALL'
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }, {
    IndexName: 'permalink-index',
    KeySchema: [{
      AttributeName: 'permalink',
      KeyType: 'HASH'
    }],
    Projection: {
      ProjectionType: 'ALL'
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }]
}, {
  TableName: 'connection',
  AttributeDefinitions: [{
    AttributeName: 'userId',
    AttributeType: 'S'
  }, {
    AttributeName: 'friendId',
    AttributeType: 'S'
  }],
  KeySchema: [{
    AttributeName: 'userId',
    KeyType: 'HASH'
  }, {
    AttributeName: 'friendId',
    KeyType: 'RANGE'
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}, {
  TableName: 'track',
  AttributeDefinitions: [{
    AttributeName: 'id',
    AttributeType: 'S'
  }],
  KeySchema: [{
    AttributeName: 'id',
    KeyType: 'HASH'
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}]
