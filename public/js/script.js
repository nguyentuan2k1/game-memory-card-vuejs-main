// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAo4Na0QTmAiovJD6CdPf5gpQ5hYVEnfTs",
  authDomain: "chat-vuejs-a7058.firebaseapp.com",
  databaseURL: "https://chat-vuejs-a7058-default-rtdb.firebaseio.com",
  projectId: "chat-vuejs-a7058",
  storageBucket: "chat-vuejs-a7058.appspot.com",
  messagingSenderId: "529377433100",
  appId: "1:529377433100:web:144b6df980efdd5d630029",
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
let provider = null;
const PayPalButton = paypal.Buttons.driver("vue", window.Vue);
Vue.component("app", {
  template: `
      <paypal-buttons [props]="{
          createOrder: createOrder,
          onApprove: onApprove
      }"></paypal-buttons>
    `,
  components: {
    "paypal-buttons": PayPalButton,
  },

  computed: {
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "0.01",
            },
          },
        ],
      });
    },
    onAuthorize: function (data, actions) {
      return actions.order.capture();
    },
  },
});
const app = new Vue({
  el: "#app",
  /*username : Biến dùng để nhận dữ liệu username
    showMessage : Biến dùng để nhận dữ liệu message do người chơi nhập thông qua input
    messages[] : Mảng dùng để chứa các message người chơi nhập và dùng for để hiện thị trên khung chat
    cards[] : Mảng cards chứa các phần tử (name, img) là dữ liệu gốc
    memoryCard[] : Mảng memoryCards chứa các pt từ mảng cards(x2) + hàm shuffle dùng để hiển thị làm dữ liệu màn chơi
    flippedCards[] : Mảng flippedCards dùng để chứa các pt mà người dùng click trên các card trên màn chơi (tối đa 2 pt)
    finish : Biến dùng để kiểm tra việc hoàn thành màn chơi
    start : Biến dùng để kiểm tra việc bắt đầu màn chơi
    turn : Biến dùng để hiển thị mỗi lượt click chọn của người chơi (click 2 card = 1 turn)
    totalTime : Đối tượng totalTime(minutes, seconds) dùng để hiển  thị thời gian chơi
    */
  data: {
    soundtrack: true,
    canNotFind: "Can't find player",
    doesNotExist: false,
    namePlayer: "",
    arrPlayer: [],
    isFullPlayer: false,
    randomImg: false,
    numberOfPlayer: 3,
    createdAt: "",
    positionMessText: "",
    positionText: "",
    bestScore: null,
    linkImg: "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg",
    rank: "",
    uid: "zrMi9zPwxpNGUlFV8QhZeaDkr142",
    darkMode: false,
    show: "game",
    login: true,
    name: "test user name",
    showMessage: "",
    messages: [],
    cards: [
      {
        name: "apple",
        img: "./public/images/apple.png",
      },
      {
        name: "banana",
        img: "./public/images/banana.png",
      },
      {
        name: "orange",
        img: "./public/images/orange.png",
      },
      {
        name: "pineapple",
        img: "./public/images/pineapple.png",
      },
      {
        name: "strawberry",
        img: "./public/images/strawberry.png",
      },
      {
        name: "watermelon",
        img: "./public/images/watermelon.png",
      },
    ],
    memoryCards: [],
    flippedCards: [],
    finish: false,
    start: false,
    turns: 0,
    totalTime: {
      minutes: 0,
      seconds: 0,
    },
    animate: true
  },
  methods: {
    showBuy() {
      this.show = "buy";
    },
    findPlayer() {
      let vue = this
      let showDataToTable = null
      console.log(vue.arrPlayer)
      console.log(vue.namePlayer)
      vue.arrPlayer.forEach((val) => {
        if (val[1].name == vue.namePlayer) {
          showDataToTable = val[1]
          return
        }
      })
      console.log(showDataToTable)
      if (showDataToTable !== null) {
        vue.doesNotExist = false
        vue.rank = `<tr><td> <img src="${showDataToTable.linkImg}"></td> <td>${showDataToTable.name}</td> 
      <td>${showDataToTable.totalTime.minutes}</td> <td>${showDataToTable.totalTime.seconds}</td >
      <td>${showDataToTable.turns} </td>
       </tr>`;
      }
      else {
        vue.doesNotExist = true
      }
    },
    loadMoreRank() {
      this.numberOfPlayer += 3;
      console.log(this.numberOfPlayer)
      this.showRank();
    },
    async addAndUpdateResult() {
      let vue = this
      let totalTime = await fire.database().ref(`player/${this.uid}/totalTime`).get();
      console.log('total:', totalTime.val())
      totalTime = totalTime.val()
      if (vue.totalTime.minutes <= totalTime.minutes)
        if (vue.totalTime.seconds < totalTime.seconds) {
          fire.database().ref(`player/${this.uid}/turns`).set(this.turns);
          fire.database().ref(`player/${this.uid}/totalTime`).set(this.totalTime);
        }
    },
    switchSoundtrack() {
      let vue = this
      vue.soundtrack = !vue.soundtrack;
      fire.database().ref(`player/${vue.uid}/soundtrack`).set(vue.soundtrack);
      if (vue.soundtrack) {
        vue.playAudio()
      } else {
        vue.pauseAudio()
      }
    },
    switchAnimate() {
      this.animate = !this.animate;
      fire.database().ref(`player/${this.uid}/animate`).set(this.animate);
    },
    switchDarkMode() {
      this.darkMode = !this.darkMode;
      fire.database().ref(`player/${this.uid}/darkMode`).set(this.darkMode);
    },
    switchRandomImg() {
      this.randomImg = !this.randomImg
      console.log(this.randomImg)
      let vue = this
      if (this.randomImg) {
        vue.cards.forEach((value) => {
          let rd = Math.floor(Math.random() * 1000);
          value.img = `https://picsum.photos/500/700?random=${rd}` //kiếm hình ảnh để random
        })
        console.log(vue.cards)
      } else {
        vue.cards = [
          {
            name: "apple",
            img: "./public/images/apple.png",
          },
          {
            name: "banana",
            img: "./public/images/banana.png",
          },
          {
            name: "orange",
            img: "./public/images/orange.png",
          },
          {
            name: "pineapple",
            img: "./public/images/pineapple.png",
          },
          {
            name: "strawberry",
            img: "./public/images/strawberry.png",
          },
          {
            name: "watermelon",
            img: "./public/images/watermelon.png",
          },
        ]
        console.log(vue.cards)
      }
      fire.database().ref(`player/${this.uid}/randomImg`).set(this.randomImg);
    },
    showAbout() {
      this.show = "about";
    },
    showSetting() {
      this.show = "setting";
    },
    showChat() {
      this.show = "chat";
    },
    showGame() {
      this.show = "game";
      this.reset();
    },
    showRank() {
      this.show = "rank";
      let b = "";
      let vue = this;
      vue.doesNotExist = false
      firebase.database().ref("player").get().then(function (dataSnapshot) {
        vue.arrPlayer = Object.entries(dataSnapshot.val());
        a = vue.arrPlayer
        console.log(a);
        //sort by totalTime
        let temp = 0;
        let minutes = 0;
        let seconds = 0;
        let totalTime = 0,
          totalTimee = 0;
        for (let i = 0; i < a.length - 1; i++)
          for (let j = i + 1; j < a.length; j++) {
            turns = a[i][1].turns;
            minutes = a[i][1].totalTime.minutes;
            seconds = a[i][1].totalTime.seconds;
            totalTime = minutes * 60 + seconds;
            turns = a[j][1].turns;
            minutes = a[j][1].totalTime.minutes;
            seconds = a[j][1].totalTime.seconds;
            totalTimee = minutes * 60 + seconds;
            if (totalTime > totalTimee) {
              temp = a[i];
              a[i] = a[j];
              a[j] = temp;
            }
            if (totalTime == totalTimee) {
              if (a[i][1].turns > a[j][1].turns) {
                temp = a[i];
                a[i] = a[j];
                a[j] = temp;
              }
            }
          }
        //show player
        if (vue.numberOfPlayer > a.length) {
          vue.numberOfPlayer = a.length;
          vue.isFullPlayer = true
        }
        if (a.length < 10) {
          for (let i = 0; i < vue.numberOfPlayer; i++) {
            b += `<tr><td> <img src="${a[i][1].linkImg}"></td> <td>${a[i][1].name}</td> 
              <td>${a[i][1].totalTime.minutes}</td> <td>${a[i][1].totalTime.seconds}</td >
              <td>${a[i][1].turns} </td>
               </tr>`;
          }
          vue.rank = b
        }
      });
    },
    showProfile() {
      this.show = "profile";
      let vue = this
      firebase
        .database()
        .ref(`player/${vue.uid}`)
        .get()
        .then((data) => {
          console.log(data.val())
          vue.turns = data.val().turns;
          vue.totalTime.minutes = data.val().totalTime.minutes;
          vue.totalTime.seconds = data.val().totalTime.seconds;
          console.log(vue.turns);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    btnLogout() {
      let vue = this
      vue.login = true;
      vue.darkMode = false;
      vue.animate = true;
      vue.soundtrack = false;
      vue.pauseAudio()
      vue.totalTime = {
        minutes: 0,
        seconds: 0,
      };
      vue.turns = 0;
      vue.reset();
    },
    playAudio() {
      let vue = this
      if (vue.audio == undefined) {
        vue.audio = new Audio('./public/audio/demon slayer op.mp3');
        vue.audio.play()
        vue.audio.loop = true
      } else {
        vue.audio.play()
        vue.audio.loop = true
      }
    },
    pauseAudio() {
      let vue = this
      console.log(vue.audio)
      if (vue.audio != undefined)
        vue.audio.pause()
    },
    loginFbAndGg(s) {
      let vue = this;
      if (s === "gg") provider = new firebase.auth.GoogleAuthProvider();
      if (s === "fb") provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(async function (result) {
          // The signed-in user info.
          user = result.user;
          console.log("User>>", user);
          vue.login = false;
          vue.name = user.displayName;
          vue.uid = user.uid;
          vue.linkImg = user.photoURL;
          console.log("uid:", vue.uid);
          let data = await firebase.database().ref(`player/${vue.uid}`).get()
          console.log(data.val())
          if (data.val() == null) {
            fire.database().ref(`player/${vue.uid}/name`).set(vue.name);
            fire.database().ref(`player/${vue.uid}/turns`).set(9999);
            fire.database().ref(`player/${vue.uid}/totalTime`).set({
              minutes: 9999,
              seconds: 9999
            });
            fire.database().ref(`player/${vue.uid}/linkImg`).set(vue.linkImg);
            fire.database().ref(`player/${vue.uid}/darkMode`).set(false);
            fire.database().ref(`player/${vue.uid}/randomImg`).set(false);
            fire.database().ref(`player/${vue.uid}/animate`).set(true);
            fire.database().ref(`player/${vue.uid}/soundtrack`).set(true);
            vue.playAudio()
          } else {
            firebase.database().ref(`player/${vue.uid}/darkMode`).get().then((data) => {
              vue.darkMode = data.val();
            });
            firebase.database().ref(`player/${vue.uid}/randomImg`).get().then((data) => {
              vue.randomImg = data.val();
            });
            firebase.database().ref(`player/${vue.uid}/animate`).get().then((data) => {
              vue.randomImg = data.val();
            });
            firebase.database().ref(`player/${vue.uid}/soundtrack`).get().then((data) => {
              vue.soundtrack = data.val();
              console.log(vue.soundtrack)
              if (vue.soundtrack) {
                vue.playAudio()
              } else {
                vue.pauseAudio()
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    /*Hàm send message
    Với Text là input(showMessage) và name*/
    sendMessage() {
      const message = {
        id: this.uid,
        linkImg: this.linkImg,
        text: this.showMessage,
        name: this.name,
        createdAt: moment().format("LLL"),
      };
      fire
        .database()
        /*Truy cập tới DOM message thông qua hàm ref
        Và dùng hàm push để đưa phần const message vào mảng message và dùng for để hiển thị */
        .ref("messages")
        .push(message);
      /*Gán showMessage lại bằng ""*/
      this.showMessage = "";
    },
    /*Hàm flipCard dùng để gán biến isFlipped = true (Đang lật) 
    Với tham số truyền vào là card vừa click*/
    // xin phép đóng hàm này vì nó trùng và hình như là ko đụng gì tới hàm này luôn
    // flipCard(card) {
    //   card.isFlipped = true;
      
    // },


    /*Hàm reset được gọi khi ấn button Restart
     */
    reset() {
      clearInterval(this.interval);
      /*Gán isFlipped(Đang lật), isMatched(Trùng nhau) của tất cả các card thông qua mảng card bằng false*/
      this.cards.forEach((card) => {
        Vue.set(card, "isFlipped", false);
        Vue.set(card, "isMatched", false);
      });

      /*Gán lại thông số ban đầu để bắt đầu lại màn chơi mới*/
      setTimeout(() => {
        /*set mảng memoryCards bằng rỗng*/
        this.memoryCards = [];

        /*Đặt lại mảng memoryCard
        Hàm shuffle để xáo trộn các phần tử card trong mảng memoryCard
        Hàm cloneDeep để sao chép mảng card
        Hàm concat để nối 2 mảng card vừa sao chép vào mảng memoryCard*/
        this.memoryCards = _.shuffle(
          this.memoryCards.concat(
            _.cloneDeep(this.cards),
            _.cloneDeep(this.cards)
          )
        );

        /*Set totalTime(minute và second) lại băng 0*/
        this.totalTime.minutes = 0;
        this.totalTime.seconds = 0;

        /*Gán biến start và finish bằng false
        Biến finish để làm điều kiện hiển thị style(badge-success || badge-light) cho biến turn
        Biến start để làm điều kiện (disabled) cho phép click button Restart*/
        this.start = false;
        this.finish = false;

        /*Gán biến turns bằng 0*/
        this.turns = 0;

        /*Gán mảng fiippedCards bằng rỗng*/
        this.flippedCards = [];
      }, 600);
    },

    // Hàm này dùng để start game
    // Đặt biến cho hàm setInterval -> để lát gọi mà xóa
    // Và hàm setInterval() là hàm thực hiện cái hàm tick sau 1s thời gian chờ
    _startGame() {
      this._tick();
      this.interval = setInterval(this._tick, 1000);
      this.start = true;
    },

    // Hàm tick này chỉ đơn giản là đếm thời gian thôi -> nếu thời gian !=59 thì cho chạy giây tiếp nếu = thì phút++
    // Còn giây cho về = 0
    _tick() {
      if (this.totalTime.seconds !== 59) {
        this.totalTime.seconds++;
        return;
      }
      this.totalTime.minutes++;
      this.totalTime.seconds = 0;
    },

    /*Hàm flipCard được gọi khi click vào card trên màn chơi với tham số truyền vào là card tương ứng*/
    flipCard(card) {
      if (card.isMatched || card.isFlipped || this.flippedCards.length === 2)
        return;

      /*Nếu biến start bằng true thì gọi hàm startGame()*/
      if (!this.start) {
        this._startGame();
      }

      card.isFlipped = true;
      // Khi bấm vào card bất kì nó tạo ra cái Audio và đưa link vào
      // t lồng 2 cái settimeout vì sau 1s nó chạy cái nhạc lên
      // thì tới cái settimeout bên trong cũng sau 1s nó dừng nhạc và cho thời gian chạy về =0 -> coi như bắt đầuo
      setTimeout(()=>{
        let audiotick=new Audio('./public/audio/tick.mp3');
        audiotick.play();
      
        setTimeout(()=>{
          audiotick.pause();
          audiotick.currentTime=0; 
        },1000)

      },1000);


      /*Nếu mảng flippedCards.length < 2 thì push card vừa click vào mảng*/
      if (this.flippedCards.length < 2) this.flippedCards.push(card);

      /*Nếu mảng flippedCards.length = 2 thì thì gọi hàm _match(card vừa click)*/
      if (this.flippedCards.length === 2) this._match(card);
    },

    // Nếu như 2 card giống nhau ấy thì nó sẽ đặt biến isMatched của 2 card này là true
    // Nếu như tất cả các card đều dc nối thì nó sẽ dừng đếm thời gian và đặt biến isfinish = true
    _match(card) {
      /*Biến turns += 1*/
      this.turns++;

      /*Kiểm tra mảng flippedCards gồm 2 card
      Nếu (object)card(1) == (object)card(2)
      Thì gán cho 2 phần tử thuộc tính isMatched bằng true và gán mảng flippedCards bằng rỗng*/
      if (this.flippedCards[0].name === this.flippedCards[1].name) {
        setTimeout(() => {
          this.flippedCards.forEach((card) => (card.isMatched = true));
          this.flippedCards = [];

          //Nếu tất cả các card trong mảng memoryCard đều có thuộc tính isMatched bằng true
          if (this.memoryCards.every((card) => card.isMatched === true)) {
            /*Dừng đếm thời gian*/
            clearInterval(this.interval);

            /*Đặt biến finish bằng true*/
            this.finish = true;
          }
        }, 400);
      } else {

        /*Nếu (object)card(1) != (object)card(2)
        Thì gán cho 2 phần tử thuộc tính isFlipped bằng false và gán mảng flippedCards bằng rỗng*/
        setTimeout(() => {
          this.flippedCards.forEach((card) => {
            card.isFlipped = false;
          });
          this.flippedCards = [];
        }, 800);
      }
    },
  },

  // Hook của Vuejs khi khởi tạo nó thì nó gọi hàm này
  created() {
    this.reset();
  },

  /*format hiển thị thời gian chơi*/
  computed: {
    sec() {
      /*Nếu seconds < 10
      Thì return thêm 0 phía trước (0 + (1..9))*/
      if (this.totalTime.seconds < 10) {
        return "0" + this.totalTime.seconds;
      }

      /*Nếu seconds > 10
      Thì return về seconds*/
      return this.totalTime.seconds;
    },
    min() {
      /*Nếu min < 10
      Thì return thêm 0 phía trước (0 + (1..9))*/
      if (this.totalTime.minutes < 10) {
        return "0" + this.totalTime.minutes;
      }

      /*Nếu min > 10
      Thì return về min*/
      return this.totalTime.minutes;
    },
  },
  mounted() {
    let vue = this;
    const itemsRef = fire.database().ref("messages");
    itemsRef.on("value", (snapshot) => {
      let data = snapshot.val();
      let messages = [];
      Object.keys(data).forEach((key) => {
        if (data[key].id === vue.uid) {
          messages.unshift({
            name: data[key].name,
            text: data[key].text,
            createdAt: moment(data[key].createdAt, "LLL").fromNow(),
            linkImg: data[key].linkImg,
            positionMessText: "message-text-right",
            positionText: "text-right img-and-name-right"
          });
        } else {
          messages.unshift({
            name: data[key].name,
            text: data[key].text,
            createdAt: moment(data[key].createdAt, "LLL").fromNow(),
            linkImg: data[key].linkImg,
            positionMessText: "message-text-left",
            positionText: "text-left img-and-name-left"
          });
        }
      });
      vue.messages = messages;
    });
  },
});
$(document).ready(function () {
  $('#app').show();
  $('#msg').hide();
});
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });
  // scroll body to 0px on click
  $('#back-to-top').click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 400);
    return false;
  });
});
