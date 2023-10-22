import { MissionUtils } from "@woowacourse/mission-utils";

class App {
  computer = [];
  user = [];
  ballNumber = 0;
  strikeNumber = 0;
  keepPlaying = true;

  async play() {
    MissionUtils.Console.print("숫자 야구 게임을 시작합니다.");
    this.initializeComputerNumber();
    while (this.keepPlaying) {
      const userNumber = await this.getUserNumber();
      const validatedUserNumber = this.validateUserNumber(userNumber);
      if (!validatedUserNumber) {
        continue;
      }
      this.initializeUserNumber(validatedUserNumber);
      this.compareUserComputerNumber();
      this.printCompareResult();
      if (this.gameOver()) {
        const input = await this.answerKeepGoingOrOver();
        this.setGameState(input);
      }
      this.user = [];
      this.ballNumber = 0;
      this.strikeNumber = 0;
    }
  }

  async getUserNumber() {
    const number = await MissionUtils.Console.readLineAsync(
      "숫자를 입력해주세요 : "
    );
    return number;
  }

  validateUserNumber(number) {
    try {
      const value = Number(number);

      if (typeof value !== "number" || isNaN(value)) {
        throw new Error();
      }
      const arr = this.formattingUserNumber(value);

      if (arr.length !== 3) {
        throw new Error();
      }
      const set = new Set([...arr]);

      if (set.size !== 3) {
        throw new Error();
      }

      return arr;
    } catch (error) {
      throw new Error("[ERROR] 올바른 형식을 입력해 주세요.");
    }
  }

  formattingUserNumber(number) {
    const stringifiedNumber = number + "";
    const targetArr = stringifiedNumber.split("");
    return targetArr;
  }

  initializeUserNumber(userNumberArr) {
    userNumberArr.forEach((element) => {
      this.user.push(Number(element));
    });
  }

  initializeComputerNumber() {
    while (this.computer.length < 3) {
      const number = MissionUtils.Random.pickNumberInRange(1, 9);
      if (!this.computer.includes(number)) {
        this.computer.push(number);
      }
    }
  }

  compareUserComputerNumber() {
    this.user.forEach((element, index) => {
      const result = this.computer.includes(element);
      if (result) {
        this.checkIsStrike(index, element)
          ? this.strikeNumber++
          : this.ballNumber++;
      }
    });
  }

  checkIsStrike(index, element) {
    return element === this.computer[index];
  }

  gameOver() {
    return this.strikeNumber === 3;
  }

  printCompareResult() {
    const ballResultOutput =
      this.ballNumber === 0 ? "" : `${this.ballNumber}볼 `;

    const strikeResultOutput =
      this.strikeNumber === 0 ? "" : `${this.strikeNumber}스트라이크`;

    if (ballResultOutput === "" && strikeResultOutput === "") {
      MissionUtils.Console.print("낫싱");
      return;
    }

    MissionUtils.Console.print(ballResultOutput + strikeResultOutput);
    return;
  }

  async answerKeepGoingOrOver() {
    MissionUtils.Console.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료");
    MissionUtils.Console.print(
      "게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요."
    );
    const number = await MissionUtils.Console.readLineAsync("");
    return number;
  }

  setGameState(number) {
    switch (number) {
      case "2":
        this.keepPlaying = false;
        break;
      case "1":
        this.computer = [];
        this.initUserAndCount();
        this.initializeComputerNumber();
        break;
      default:
        throw new Error("[ERROR] 올바르지 않은 입력입니다.");
    }
  }

  initUserAndCount() {
    this.user = [];
    this.strikeNumber = 0;
    this.ballNumber = 0;
  }
}

export default App;
