const generateMembershipNumber = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 10000);
  return `MEM-${timestamp.slice(-8)}-${randomNum}`;
};

module.exports = generateMembershipNumber;
