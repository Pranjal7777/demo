export const mockedVideoOrders = [
  {
    _id: "mockedVideoOrder1",
    trigger: 1,
    requestedFor: {
      _id: "61b1c4ff618d7923369753e2",
      fullName: "mary maria",
    },
    price: {
      price: 50,
      currencyCode: "DOLLAR",
      currencySymbol: "$",
    },
    status: "PENDING",
    createdDate: "2021-12-10T09:50:17.523Z",
    createdTs: 1639129817523,
    updatedAt: 1640867882319,
    allowProfileView: false,
    appCommission: 10,
    finalAmount: 40,
    attribute: [
      {
        attributeId: "61a4ac6294c26cb123d44db0",
        attributeName: "Add Instructions",
        type: "TEXT_BOX",
        value: "hello",
      },
      {
        attributeId: "61a4ad6094c26cddded44db1",
        attributeName: "Select An Occasion",
        type: "RADIO_BUTTON",
        value: "Roast",
      },
      {
        attributeId: "61b2fc78618d7932ba9753f4",
        attributeName: "Introduce Yourself",
        type: "TEXT_BOX",
        value: "meet",
      },
      {
        attributeName: "Video",
        type: "VIDEO_UPLOAD",
        attributeId: "61b2fc46618d79ac089753f3",
        value:
          "61b1c4ff618d7923369753e2/shoutOut/61b1c4ff618d7923369753e2_1639129803505_video",
        thumbnail:
          "61b1c4ff618d7923369753e2/shoutOut/61b1c4ff618d7923369753e2_1639129803505_thumb",
      },
    ],
    orderId: "mockedVideoOrder1",
    reason: "Shoutout request expired",
    isViewed: true,
    opponentUser: {
      username: "mary@gmail.com",
      firstName: "mary",
      lastName: "maria",
      profilePic: "users/profile/1639040252202_mary@gmail.com",
    },
  }
];
