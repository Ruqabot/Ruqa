import Ruqa from "./structures/Ruqa";

const ruqa = new Ruqa();
(async () => {
  await ruqa.connectWithGateway();
})();

export default ruqa;
