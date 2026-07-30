class SoroSaveClient {
  constructor(config) {
    this.config = config;
  }
}

function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 4) + "..." + address.slice(-4);
}

module.exports = {
  SoroSaveClient,
  shortenAddress
};

function formatAmount(amount) {
  return String(amount);
}

const GroupStatus = {
  Active: "ACTIVE",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
  Forming: "FORMING"
};

module.exports.formatAmount = formatAmount;
module.exports.parseAmount = formatAmount;
module.exports.getStatusLabel = function(status) { return status; };
module.exports.GroupStatus = GroupStatus;
