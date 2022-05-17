let channel_box = document.querySelector(".channel_box");
let getStreamPagination;
let isLoading = false;
let language = "zh";

// *************
// Promises方法
// *************
// function loadStream() {
//   get("https://api.twitch.tv/helix/streams?language=zh&game_id=511224").then(
//     (res) => {
//       const promises = [];
//       getStreamPagination = res.pagination.cursor;
//       res = res.data;
//       for (let i = 0; i < res.length; i++) {
//         let url = `https://api.twitch.tv/helix/search/channels?query=${res[i].user_name}&first=1`;
//         promises.push(get(url));
//       }
//       Promise.all(promises).then((res2) => {
//         for (let i = 0; i < res2.length; i++) {
//           res[i].profile_img = res2[i].data[0].thumbnail_url;
//         }
//         for (let x of res) {
//           let channel = document.createElement("div");
//           let thumbnail = x.thumbnail_url.replace(
//             "{width}x{height}",
//             "800x450"
//           );
//           channel.classList.add("channel");
//           channel.setAttribute("title", x.title);
//           channel.innerHTML = `
//               <div class="preview">
//                 <img class="preview_img" src="${thumbnail}" />
//               </div>
//               <div class="channel_info">
//                 <div class="avatar">
//                   <img class="avatar_img" src="${x.profile_img}" />
//                 </div>
//                 <div class="info_content">
//                   <div class="channel_title">${x.title}</div>
//                   <div class="channel_name">${x.user_name}</div>
//                 </div>
//               </div>
//             `;
//           container.appendChild(channel);
//         }
//         onloadImg(".preview_img");
//         onloadImg(".avatar_img");
//         console.log(getStreamPagination);
//       });
//     }
//   );
// }

function get(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("Get", url);
    xhr.setRequestHeader("Client-Id", "1dtx6kvdxhgbgya2c4z4m4v16upamw");
    xhr.setRequestHeader(
      "Authorization",
      "Bearer qu8eatmcb319iqvv3ap09fqg1r0c7i"
    );
    xhr.onload = function () {
      if (this.status == 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr));
      }
    };
    xhr.send();
  });
}

function onloadImg(className) {
  let elmArr = document.querySelectorAll(className);
  for (let elm of elmArr) {
    elm.onload = () => {
      elm.style.opacity = 1;
    };
  }
}

async function getStream(lang, pagination = null) {
  let getStreamUrl = `https://api.twitch.tv/helix/streams?language=${lang}&game_id=511224`;
  if (pagination) {
    getStreamUrl += `&after=${pagination}`;
  }
  let res = await get(getStreamUrl);
  const promises = [];
  getStreamPagination = res.pagination.cursor;
  res = res.data;
  for (let i = 0; i < res.length; i++) {
    let getChannelUrl = `https://api.twitch.tv/helix/search/channels?query=${res[i].user_name}&first=1`;
    promises.push(get(getChannelUrl));
  }
  let res2 = await Promise.all(promises);
  for (let i = 0; i < res.length; i++) {
    res[i].profile_img = res2[i].data[0].thumbnail_url;
  }
  return res;
}

function appendChannel(lang, pagination = null) {
  getStream(lang, pagination).then((res) => {
    for (let x of res) {
      let channel = document.createElement("div");
      let thumbnail = x.thumbnail_url.replace("{width}x{height}", "400x225");
      channel.classList.add("channel");
      channel.setAttribute("title", x.title);
      channel.innerHTML = `
            <div class="preview">
              <img class="preview_img" src="${thumbnail}" />
            </div>
            <div class="channel_info">
              <div class="avatar">
                <img class="avatar_img" src="${x.profile_img}" />
              </div>
              <div class="info_content">
                <div class="channel_title">${x.title}</div>
                <div class="channel_name">${x.user_name}</div>
              </div>
            </div>
          `;
      channel_box.appendChild(channel);
    }
    onloadImg(".preview_img");
    onloadImg(".avatar_img");
    isLoading = false;
  });
}

window.addEventListener("scroll", (e) => {
  if (
    window.scrollY + window.innerHeight >
    document.querySelector("html").offsetHeight - 315
  ) {
    console.log("bottom");
    if (!isLoading) {
      console.log("loading");
      isLoading = true;
      appendChannel(language, getStreamPagination);
    }
  }
});

function changeLang(lang) {
  language = lang;
  getStreamPagination = null;
  document.querySelector(".title").innerHTML = window.I18N[lang].title;
  channel_box.innerHTML = "";
  appendChannel(language);
}

function main() {
  appendChannel(language);
}

main();
