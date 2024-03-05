const BASE_URL = "https://openapi.programming-hero.com/api/retro-forum";

// const readPostIds = [];

const fetchData = async (url) => {
  document.querySelectorAll(".loading").forEach((el) => {
    el.classList.remove("hidden");
  });

  const res = await fetch(`${BASE_URL}${url}`);

  // simulating api delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  document.querySelectorAll(".loading").forEach((el) => {
    el.classList.add("hidden");
  });

  if (res.status !== 200) {
    console.log("Error fetching data");
    return null;
  }

  const data = await res.json();

  return data;
};

const loadOtherPosts = async (key, query) => {
  let url = "/posts";

  if (key && query) {
    url = `/posts?${key}=${query}`;
  }

  const data = await fetchData(url);

  data?.posts?.forEach((post) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div
        class="bg-[#F3F3F5] p-8 flex lg:flex-row flex-col gap-4 rounded-2xl"
      >
        <div>
          <div class="relative bg-white w-20 mx-auto rounded-lg">
            <img
              class="mx-auto rounded-xl"
              src=${post.image}
              alt=${post.title}
            />
            <span
              class="absolute top-1 -right-1 transform -translate-y-1/2 w-3.5 h-3.5 ${
                post.isActive ? "bg-green-600" : "bg-red-500"
              } border-2 border-white rounded-full"
            ></span>
          </div>
        </div>

        <div class="space-y-2 w-full lg:text-left text-center">
          <div
            class="flex gap-4 lg:justify-start justify-center font-mul"
          >
            <p class="">#${post.category}</p>
            <p class="">Author: ${post.author?.name ?? ""}</p>
          </div>
          <h1 class="text-2xl font-bold">
            ${post.title}
          </h1>
          <p class="text-gray-500 lg:w-full mx-auto w-[80%]">
            ${post.description}
          </p>

          <hr class="border-dashed bg-gray-400" />

          <div class="flex mx-auto lg:w-full w-[80%] justify-between">
            <div class="flex lg:gap-6 md:gap-4 gap-2">
              <p class="font-int flex gap-1 items-center"><i class="fa-regular fa-comment-dots"></i>${
                post.comment_count
              }</p>
              <p class="font-int flex gap-1 items-center"><i class="fa-regular fa-eye"></i>${
                post.view_count
              }</p>
              <p class="font-int flex gap-1 items-center">
                <i class="fa-regular fa-clock"></i>${post.posted_time}
                min
              </p>
            </div>
            <div>
              <button
                onclick="handleMarkAsRead('${post.id}', '${post.title.replace(
      /'/g,
      "\\'"
    )}', '${post.view_count}')"
                class="btn btn-circle btn-outline text-white text-xl bg-gradient-to-r from-blue-800 to-green-400"
              >
                <i class="fa-regular fa-envelope-open"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    otherPostsContainer.appendChild(div);
  });
};

const handleMarkAsRead = (id, title, viewCount) => {
  // if (readPostIds.includes(id)) {
  //   return;
  // }

  // readPostIds.push(id);

  const readCount = parseInt(count.innerHTML);
  count.innerHTML = readCount + 1;

  const readPost = document.createElement("div");
  readPost.classList.add(
    "bg-white",
    "p-2",
    "rounded-2xl",
    "flex",
    "gap-2",
    "justify-between"
  );
  readPost.innerHTML = `
    <p class="font-int text-black">${title}</p>
    <div class="flex justify-center items-center">
      <p class="font-int flex gap-2">
        <i class="fa-regular fa-eye flex items-center"></i>${viewCount}
      </p>
    </div>
  `;

  cross.appendChild(readPost);
};

const searchPosts = async () => {
  const searchText = search.value;

  otherPostsContainer.innerHTML = "";

  loadOtherPosts("category", searchText);
};

const latestPost = async () => {
  const data = await fetchData("/latest-posts");

  data?.forEach((latest) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="p-4 lg:p-6 flex flex-col  shadow-md shadow-blue-200  border rounded-2xl  gap-2 lg:gap-4 h-auto lg:h-full">
         <img src="${
           latest.cover_image
         }" alt="" class="min-w-full min-h-[80px] rounded-xl" >
         <p class="text-[#12132D99]"><i class="fa-solid fa-calendar-plus"></i>  ${
           latest.author.posted_date
             ? latest.author.posted_date
             : "No publish date"
         }</p>
         <p class="font-extrabold text-lg">${latest.title}</p>
         <p class="text-[#12132D99] w-[85%]">${latest.description}</p>
        <div class="flex justify-start flex-1 items-end">
            <img src="${
              latest.profile_image
            }" alt="profile picture" class="rounded-full w-9 h-9">
            <div class=" text-left rtl:text-right ms-3 space-y-0.5 font-medium  ">
                <p class="text-lg">${latest.author.name}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ${
                    latest.author.designation
                      ? latest.author.designation
                      : "Unknown"
                  }
                </p>
            </div>
         </div>    
     </div>`;
    latestPostContainer.appendChild(div);
  });
};

loadOtherPosts();
latestPost();
