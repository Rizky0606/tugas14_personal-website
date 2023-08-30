const express = require("express");
const dataBlog = require("./fake-data");
const app = express();
const PORT = 5000;
const path = require("path");
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.static("./src"));

app.use(express.urlencoded({ extended: false }));

const home = async (req, res) => {
  try {
    const query = `SELECT * FROM "Blogs"`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((datas) => ({
      ...datas,
    }));
    res.render("index", { dataBlog: data });
  } catch (error) {
    console.log(error);
  }
};

const blog = (req, res) => {
  res.render("blog");
};

const contact = (req, res) => {
  res.render("contact");
};

const testimonial = (req, res) => {
  res.render("testimonial");
};

const addBlog = async (req, res) => {
  try {
    const { inputName, dateStart, dateEnd, inputDescription } = req.body;
    const postAt = new Date();

    const query = `INSERT INTO "Blogs" (title, content, author, duration, "startDate", "endDate", image, "postAt", "fullTime", technologies) VALUES ('${inputName}', '${inputDescription}', 'Rizky Fauzi Ardiansyah', '${duration(
      dateStart,
      dateEnd
    )}', '${dateStart}', '${dateEnd}', 'https://www.howtopython.org/wp-content/uploads/2020/04/laptops_python-1170x780.jpg', NOW(), '${getFullTime(
      postAt
    )}', ARRAY[true, true, false, false])`;

    await sequelize.query(query);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const detailBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM "Blogs" WHERE id=${id}`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((datas) => ({
      ...datas,
    }));

    res.render("project-detail", { blog: data[0] });
  } catch (error) {
    console.log(error);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM "Blogs" WHERE id=${id}`;
    await sequelize.query(query);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM "Blogs" WHERE id=${id}`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((datas) => ({
      ...datas,
    }));
    res.render("editBlog", { data: data[0] });
  } catch (error) {
    console.log(error);
  }
};

const updateBlog = (req, res) => {
  try {
    const { id } = req.params;
    const { inputName, inputStartDate, inputEndDate, inputDescription } =
      req.body;
    const dateNow = new Date();

    const query = `UPDATE "Blogs" SET title='${inputName}', content='${inputDescription}', author='Rizky Fauzi Ardiansyah', duration='${duration(
      inputStartDate,
      inputEndDate
    )} ', "startDate"='${inputStartDate}', "endDate"='${inputEndDate}', image='https://cms.dailysocial.id/wp-content/uploads/2022/10/arpad-czapp-H424WdcQN4Y-unsplash-scaled.jpg', "postAt"=NOW(), "fullTime"='${getFullTime(
      dateNow
    )}' WHERE id=${id}`;
    sequelize.query(query);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

//
const getFullTime = (time) => {
  let date = time.getDate();

  let monthIndex = time.getMonth();

  let year = time.getFullYear();

  let hours = time.getHours();

  let minutes = time.getMinutes();

  let month;
  switch (monthIndex) {
    case 1:
      month = "Jan";
      break;
    case 2:
      month = "Feb";
      break;
    case 3:
      month = "Mar";
      break;
    case 4:
      month = "Apr";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "Jun";
      break;
    case 7:
      month = "Jul";
      break;
    case 8:
      month = "Aug";
      break;
    case 9:
      month = "Sep";
      break;
    case 10:
      month = "Oct";
      break;
    case 11:
      month = "Nov";
      break;
    case 12:
      month = "Dec";
      break;
  }

  if (hours <= 9) {
    hours = "0" + hours;
  } else if (minutes <= 9) {
    minutes = "0" + minutes;
  }

  return `${date} ${month} ${year} ${hours}:${minutes} WIB`;
};

const getDistance = (time) => {
  let timeNow = new Date();
  let timePost = time;

  let distance = timeNow - timePost;

  let milisecond = 1000;
  let secondInHours = 3600;
  let hoursInDays = 24;

  let distanceDay = Math.floor(
    distance / (milisecond * secondInHours * hoursInDays)
  );
  let distanceHours = Math.floor(distance / (milisecond * 60 * 60));
  let distanceMinutes = Math.floor(distance / (milisecond * 60));
  let distanceSecond = Math.floor(distance / milisecond);

  if (distanceDay > 0) {
    return `${distanceDay} days ago`;
  } else if (distanceHours > 0) {
    return `${distanceHours} hours ago`;
  } else if (distanceMinutes > 0) {
    return `${distanceMinutes} minutes ago`;
  } else {
    return `${distanceSecond} seconds ago`;
  }
};

const duration = (startDate, endDate) => {
  let start = new Date(startDate);
  let end = new Date(endDate);

  let times = end.getTime() - start.getTime();
  let milisecond = 1000;
  let secondInHours = 3600;
  let hoursInDays = 24;
  let days = times / (milisecond * secondInHours * hoursInDays);
  let weeks = Math.floor(days / 7);
  let months = Math.floor(weeks / 4);
  let years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} Tahun`;
  } else if (months > 0) {
    return `${months} Bulan`;
  } else if (weeks > 0) {
    return `${weeks} Minggu`;
  } else {
    return `${days} Hari`;
  }
};

// rounting
// get
app.get("/", home);
app.get("/blog", blog);
app.get("/contact", contact);
app.get("/testimonial", testimonial);
app.get("/blogDetail/:id", detailBlog);
app.get("/editBlog/:id", editBlog);

// post
app.post("/blog", addBlog);

// put
app.post("/editBlog/:id", updateBlog);

// delete
app.get("/deleteBlog/:id", deleteBlog);

// local server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
