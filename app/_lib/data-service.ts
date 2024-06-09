import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import { notFound } from "next/navigation";

// get cabin response type
export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
};

// get cabins response type
export type Cabins = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
};

type NewGuestParams = {
  fullName?: string;
  email?: string;
  nationalId?: string;
  nationality?: string;
  countryFlag?: string;
};

export type Guest = {
  id: number;
  created_at: Date;
  fullName: string;
  email: string;
  nationalID: null | string;
  nationality: null | string;
  countryFlag: null | string;
};

export type Booking = {
  id: string;
  guestId: number;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  cabinId: number;
  created_at: string;
  cabins: { name: string; image: string };
};

export type GetBooking = {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: string;
  hasBreakfast: true;
  isPaid: false;
  observations: string;
  cabinId: number;
  guestId: number;
};

/////////////
// GET

export async function getCabin(id: string) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error || !data) {
    console.error(error);
    notFound();
  }

  return data as Cabin;
}

export async function getCabinPrice(id: string) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error || !data) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data as Cabins[];
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  if (!data || error) throw new Error("getting guest failed");

  // No error here! We handle the possibility of no guest in the sign in callback
  return data as Guest;
}

export async function getBooking(id: string) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Booking could not get loaded");

  return data as GetBooking;
}

export async function getBookings(guestId: string) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  let booking: Booking[] = [];
  // @ts-expect-error todo: temp solution ⏰
  if (data) booking = data;

  return booking;
}

export async function getBookedDatesByCabinId(cabinId: string) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  // @ts-expect-error todo: temp solution ⏰
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    // todo: api call fails because of my internet
    // const res = await fetch(
    //   "https://restcountries.com/v2/all?fields=name,flag"
    // );
    // const countries = await res.json();
    const countries = [
      {
        name: "Afghanistan",
        flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg",
        independent: false,
      },
      {
        name: "Åland Islands",
        flag: "https://flagcdn.com/ax.svg",
        independent: false,
      },
      {
        name: "Albania",
        flag: "https://flagcdn.com/al.svg",
        independent: false,
      },
      {
        name: "Algeria",
        flag: "https://flagcdn.com/dz.svg",
        independent: false,
      },
      {
        name: "American Samoa",
        flag: "https://flagcdn.com/as.svg",
        independent: false,
      },
      {
        name: "Andorra",
        flag: "https://flagcdn.com/ad.svg",
        independent: false,
      },
      {
        name: "Angola",
        flag: "https://flagcdn.com/ao.svg",
        independent: false,
      },
      {
        name: "Anguilla",
        flag: "https://flagcdn.com/ai.svg",
        independent: false,
      },
      {
        name: "Antarctica",
        flag: "https://flagcdn.com/aq.svg",
        independent: false,
      },
      {
        name: "Antigua and Barbuda",
        flag: "https://flagcdn.com/ag.svg",
        independent: false,
      },
      {
        name: "Argentina",
        flag: "https://flagcdn.com/ar.svg",
        independent: false,
      },
      {
        name: "Armenia",
        flag: "https://flagcdn.com/am.svg",
        independent: false,
      },
      {
        name: "Aruba",
        flag: "https://flagcdn.com/aw.svg",
        independent: false,
      },
      {
        name: "Australia",
        flag: "https://flagcdn.com/au.svg",
        independent: false,
      },
      {
        name: "Austria",
        flag: "https://flagcdn.com/at.svg",
        independent: false,
      },
      {
        name: "Azerbaijan",
        flag: "https://flagcdn.com/az.svg",
        independent: false,
      },
      {
        name: "Bahamas",
        flag: "https://flagcdn.com/bs.svg",
        independent: false,
      },
      {
        name: "Bahrain",
        flag: "https://flagcdn.com/bh.svg",
        independent: false,
      },
      {
        name: "Bangladesh",
        flag: "https://flagcdn.com/bd.svg",
        independent: false,
      },
      {
        name: "Barbados",
        flag: "https://flagcdn.com/bb.svg",
        independent: false,
      },
      {
        name: "Belarus",
        flag: "https://flagcdn.com/by.svg",
        independent: false,
      },
      {
        name: "Belgium",
        flag: "https://flagcdn.com/be.svg",
        independent: false,
      },
      {
        name: "Belize",
        flag: "https://flagcdn.com/bz.svg",
        independent: false,
      },
      {
        name: "Benin",
        flag: "https://flagcdn.com/bj.svg",
        independent: false,
      },
      {
        name: "Bermuda",
        flag: "https://flagcdn.com/bm.svg",
        independent: false,
      },
      {
        name: "Bhutan",
        flag: "https://flagcdn.com/bt.svg",
        independent: false,
      },
      {
        name: "Bolivia (Plurinational State of)",
        flag: "https://flagcdn.com/bo.svg",
        independent: false,
      },
      {
        name: "Bonaire, Sint Eustatius and Saba",
        flag: "https://flagcdn.com/bq.svg",
        independent: false,
      },
      {
        name: "Bosnia and Herzegovina",
        flag: "https://flagcdn.com/ba.svg",
        independent: false,
      },
      {
        name: "Botswana",
        flag: "https://flagcdn.com/bw.svg",
        independent: false,
      },
      {
        name: "Bouvet Island",
        flag: "https://flagcdn.com/bv.svg",
        independent: false,
      },
      {
        name: "Brazil",
        flag: "https://flagcdn.com/br.svg",
        independent: false,
      },
      {
        name: "British Indian Ocean Territory",
        flag: "https://flagcdn.com/io.svg",
        independent: false,
      },
      {
        name: "United States Minor Outlying Islands",
        flag: "https://flagcdn.com/um.svg",
        independent: false,
      },
      {
        name: "Virgin Islands (British)",
        flag: "https://flagcdn.com/vg.svg",
        independent: false,
      },
      {
        name: "Virgin Islands (U.S.)",
        flag: "https://flagcdn.com/vi.svg",
        independent: false,
      },
      {
        name: "Brunei Darussalam",
        flag: "https://flagcdn.com/bn.svg",
        independent: false,
      },
      {
        name: "Bulgaria",
        flag: "https://flagcdn.com/bg.svg",
        independent: false,
      },
      {
        name: "Burkina Faso",
        flag: "https://flagcdn.com/bf.svg",
        independent: false,
      },
      {
        name: "Burundi",
        flag: "https://flagcdn.com/bi.svg",
        independent: false,
      },
      {
        name: "Cambodia",
        flag: "https://flagcdn.com/kh.svg",
        independent: false,
      },
      {
        name: "Cameroon",
        flag: "https://flagcdn.com/cm.svg",
        independent: false,
      },
      {
        name: "Canada",
        flag: "https://flagcdn.com/ca.svg",
        independent: false,
      },
      {
        name: "Cabo Verde",
        flag: "https://flagcdn.com/cv.svg",
        independent: false,
      },
      {
        name: "Cayman Islands",
        flag: "https://flagcdn.com/ky.svg",
        independent: false,
      },
      {
        name: "Central African Republic",
        flag: "https://flagcdn.com/cf.svg",
        independent: false,
      },
      {
        name: "Chad",
        flag: "https://flagcdn.com/td.svg",
        independent: false,
      },
      {
        name: "Chile",
        flag: "https://flagcdn.com/cl.svg",
        independent: false,
      },
      {
        name: "China",
        flag: "https://flagcdn.com/cn.svg",
        independent: false,
      },
      {
        name: "Christmas Island",
        flag: "https://flagcdn.com/cx.svg",
        independent: false,
      },
      {
        name: "Cocos (Keeling) Islands",
        flag: "https://flagcdn.com/cc.svg",
        independent: false,
      },
      {
        name: "Colombia",
        flag: "https://flagcdn.com/co.svg",
        independent: false,
      },
      {
        name: "Comoros",
        flag: "https://flagcdn.com/km.svg",
        independent: false,
      },
      {
        name: "Congo",
        flag: "https://flagcdn.com/cg.svg",
        independent: false,
      },
      {
        name: "Congo (Democratic Republic of the)",
        flag: "https://flagcdn.com/cd.svg",
        independent: false,
      },
      {
        name: "Cook Islands",
        flag: "https://flagcdn.com/ck.svg",
        independent: false,
      },
      {
        name: "Costa Rica",
        flag: "https://flagcdn.com/cr.svg",
        independent: false,
      },
      {
        name: "Croatia",
        flag: "https://flagcdn.com/hr.svg",
        independent: false,
      },
      {
        name: "Cuba",
        flag: "https://flagcdn.com/cu.svg",
        independent: false,
      },
      {
        name: "Curaçao",
        flag: "https://flagcdn.com/cw.svg",
        independent: false,
      },
      {
        name: "Cyprus",
        flag: "https://flagcdn.com/cy.svg",
        independent: false,
      },
      {
        name: "Czech Republic",
        flag: "https://flagcdn.com/cz.svg",
        independent: false,
      },
      {
        name: "Denmark",
        flag: "https://flagcdn.com/dk.svg",
        independent: false,
      },
      {
        name: "Djibouti",
        flag: "https://flagcdn.com/dj.svg",
        independent: false,
      },
      {
        name: "Dominica",
        flag: "https://flagcdn.com/dm.svg",
        independent: false,
      },
      {
        name: "Dominican Republic",
        flag: "https://flagcdn.com/do.svg",
        independent: false,
      },
      {
        name: "Ecuador",
        flag: "https://flagcdn.com/ec.svg",
        independent: false,
      },
      {
        name: "Egypt",
        flag: "https://flagcdn.com/eg.svg",
        independent: false,
      },
      {
        name: "El Salvador",
        flag: "https://flagcdn.com/sv.svg",
        independent: false,
      },
      {
        name: "Equatorial Guinea",
        flag: "https://flagcdn.com/gq.svg",
        independent: false,
      },
      {
        name: "Eritrea",
        flag: "https://flagcdn.com/er.svg",
        independent: false,
      },
      {
        name: "Estonia",
        flag: "https://flagcdn.com/ee.svg",
        independent: false,
      },
      {
        name: "Ethiopia",
        flag: "https://flagcdn.com/et.svg",
        independent: false,
      },
      {
        name: "Falkland Islands (Malvinas)",
        flag: "https://flagcdn.com/fk.svg",
        independent: false,
      },
      {
        name: "Faroe Islands",
        flag: "https://flagcdn.com/fo.svg",
        independent: false,
      },
      {
        name: "Fiji",
        flag: "https://flagcdn.com/fj.svg",
        independent: false,
      },
      {
        name: "Finland",
        flag: "https://flagcdn.com/fi.svg",
        independent: false,
      },
      {
        name: "France",
        flag: "https://flagcdn.com/fr.svg",
        independent: false,
      },
      {
        name: "French Guiana",
        flag: "https://flagcdn.com/gf.svg",
        independent: false,
      },
      {
        name: "French Polynesia",
        flag: "https://flagcdn.com/pf.svg",
        independent: false,
      },
      {
        name: "French Southern Territories",
        flag: "https://flagcdn.com/tf.svg",
        independent: false,
      },
      {
        name: "Gabon",
        flag: "https://flagcdn.com/ga.svg",
        independent: false,
      },
      {
        name: "Gambia",
        flag: "https://flagcdn.com/gm.svg",
        independent: false,
      },
      {
        name: "Georgia",
        flag: "https://flagcdn.com/ge.svg",
        independent: false,
      },
      {
        name: "Germany",
        flag: "https://flagcdn.com/de.svg",
        independent: false,
      },
      {
        name: "Ghana",
        flag: "https://flagcdn.com/gh.svg",
        independent: false,
      },
      {
        name: "Gibraltar",
        flag: "https://flagcdn.com/gi.svg",
        independent: false,
      },
      {
        name: "Greece",
        flag: "https://flagcdn.com/gr.svg",
        independent: false,
      },
      {
        name: "Greenland",
        flag: "https://flagcdn.com/gl.svg",
        independent: false,
      },
      {
        name: "Grenada",
        flag: "https://flagcdn.com/gd.svg",
        independent: false,
      },
      {
        name: "Guadeloupe",
        flag: "https://flagcdn.com/gp.svg",
        independent: false,
      },
      {
        name: "Guam",
        flag: "https://flagcdn.com/gu.svg",
        independent: false,
      },
      {
        name: "Guatemala",
        flag: "https://flagcdn.com/gt.svg",
        independent: false,
      },
      {
        name: "Guernsey",
        flag: "https://flagcdn.com/gg.svg",
        independent: false,
      },
      {
        name: "Guinea",
        flag: "https://flagcdn.com/gn.svg",
        independent: false,
      },
      {
        name: "Guinea-Bissau",
        flag: "https://flagcdn.com/gw.svg",
        independent: false,
      },
      {
        name: "Guyana",
        flag: "https://flagcdn.com/gy.svg",
        independent: false,
      },
      {
        name: "Haiti",
        flag: "https://flagcdn.com/ht.svg",
        independent: false,
      },
      {
        name: "Heard Island and McDonald Islands",
        flag: "https://flagcdn.com/hm.svg",
        independent: false,
      },
      {
        name: "Vatican City",
        flag: "https://flagcdn.com/va.svg",
        independent: false,
      },
      {
        name: "Honduras",
        flag: "https://flagcdn.com/hn.svg",
        independent: false,
      },
      {
        name: "Hungary",
        flag: "https://flagcdn.com/hu.svg",
        independent: false,
      },
      {
        name: "Hong Kong",
        flag: "https://flagcdn.com/hk.svg",
        independent: false,
      },
      {
        name: "Iceland",
        flag: "https://flagcdn.com/is.svg",
        independent: false,
      },
      {
        name: "India",
        flag: "https://flagcdn.com/in.svg",
        independent: false,
      },
      {
        name: "Indonesia",
        flag: "https://flagcdn.com/id.svg",
        independent: false,
      },
      {
        name: "Ivory Coast",
        flag: "https://flagcdn.com/ci.svg",
        independent: false,
      },
      {
        name: "Iran (Islamic Republic of)",
        flag: "https://flagcdn.com/ir.svg",
        independent: false,
      },
      {
        name: "Iraq",
        flag: "https://flagcdn.com/iq.svg",
        independent: false,
      },
      {
        name: "Ireland",
        flag: "https://flagcdn.com/ie.svg",
        independent: false,
      },
      {
        name: "Isle of Man",
        flag: "https://flagcdn.com/im.svg",
        independent: false,
      },
      {
        name: "Israel",
        flag: "https://flagcdn.com/il.svg",
        independent: false,
      },
      {
        name: "Italy",
        flag: "https://flagcdn.com/it.svg",
        independent: false,
      },
      {
        name: "Jamaica",
        flag: "https://flagcdn.com/jm.svg",
        independent: false,
      },
      {
        name: "Japan",
        flag: "https://flagcdn.com/jp.svg",
        independent: false,
      },
      {
        name: "Jersey",
        flag: "https://flagcdn.com/je.svg",
        independent: false,
      },
      {
        name: "Jordan",
        flag: "https://flagcdn.com/jo.svg",
        independent: false,
      },
      {
        name: "Kazakhstan",
        flag: "https://flagcdn.com/kz.svg",
        independent: false,
      },
      {
        name: "Kenya",
        flag: "https://flagcdn.com/ke.svg",
        independent: false,
      },
      {
        name: "Kiribati",
        flag: "https://flagcdn.com/ki.svg",
        independent: false,
      },
      {
        name: "Kuwait",
        flag: "https://flagcdn.com/kw.svg",
        independent: false,
      },
      {
        name: "Kyrgyzstan",
        flag: "https://flagcdn.com/kg.svg",
        independent: false,
      },
      {
        name: "Lao People's Democratic Republic",
        flag: "https://flagcdn.com/la.svg",
        independent: false,
      },
      {
        name: "Latvia",
        flag: "https://flagcdn.com/lv.svg",
        independent: false,
      },
      {
        name: "Lebanon",
        flag: "https://flagcdn.com/lb.svg",
        independent: false,
      },
      {
        name: "Lesotho",
        flag: "https://flagcdn.com/ls.svg",
        independent: false,
      },
      {
        name: "Liberia",
        flag: "https://flagcdn.com/lr.svg",
        independent: false,
      },
      {
        name: "Libya",
        flag: "https://flagcdn.com/ly.svg",
        independent: false,
      },
      {
        name: "Liechtenstein",
        flag: "https://flagcdn.com/li.svg",
        independent: false,
      },
      {
        name: "Lithuania",
        flag: "https://flagcdn.com/lt.svg",
        independent: false,
      },
      {
        name: "Luxembourg",
        flag: "https://flagcdn.com/lu.svg",
        independent: false,
      },
      {
        name: "Macao",
        flag: "https://flagcdn.com/mo.svg",
        independent: false,
      },
      {
        name: "North Macedonia",
        flag: "https://flagcdn.com/mk.svg",
        independent: false,
      },
      {
        name: "Madagascar",
        flag: "https://flagcdn.com/mg.svg",
        independent: false,
      },
      {
        name: "Malawi",
        flag: "https://flagcdn.com/mw.svg",
        independent: false,
      },
      {
        name: "Malaysia",
        flag: "https://flagcdn.com/my.svg",
        independent: false,
      },
      {
        name: "Maldives",
        flag: "https://flagcdn.com/mv.svg",
        independent: false,
      },
      {
        name: "Mali",
        flag: "https://flagcdn.com/ml.svg",
        independent: false,
      },
      {
        name: "Malta",
        flag: "https://flagcdn.com/mt.svg",
        independent: false,
      },
      {
        name: "Marshall Islands",
        flag: "https://flagcdn.com/mh.svg",
        independent: false,
      },
      {
        name: "Martinique",
        flag: "https://flagcdn.com/mq.svg",
        independent: false,
      },
      {
        name: "Mauritania",
        flag: "https://flagcdn.com/mr.svg",
        independent: false,
      },
      {
        name: "Mauritius",
        flag: "https://flagcdn.com/mu.svg",
        independent: false,
      },
      {
        name: "Mayotte",
        flag: "https://flagcdn.com/yt.svg",
        independent: false,
      },
      {
        name: "Mexico",
        flag: "https://flagcdn.com/mx.svg",
        independent: false,
      },
      {
        name: "Micronesia (Federated States of)",
        flag: "https://flagcdn.com/fm.svg",
        independent: false,
      },
      {
        name: "Moldova (Republic of)",
        flag: "https://flagcdn.com/md.svg",
        independent: false,
      },
      {
        name: "Monaco",
        flag: "https://flagcdn.com/mc.svg",
        independent: false,
      },
      {
        name: "Mongolia",
        flag: "https://flagcdn.com/mn.svg",
        independent: false,
      },
      {
        name: "Montenegro",
        flag: "https://flagcdn.com/me.svg",
        independent: false,
      },
      {
        name: "Montserrat",
        flag: "https://flagcdn.com/ms.svg",
        independent: false,
      },
      {
        name: "Morocco",
        flag: "https://flagcdn.com/ma.svg",
        independent: false,
      },
      {
        name: "Mozambique",
        flag: "https://flagcdn.com/mz.svg",
        independent: false,
      },
      {
        name: "Myanmar",
        flag: "https://flagcdn.com/mm.svg",
        independent: false,
      },
      {
        name: "Namibia",
        flag: "https://flagcdn.com/na.svg",
        independent: false,
      },
      {
        name: "Nauru",
        flag: "https://flagcdn.com/nr.svg",
        independent: false,
      },
      {
        name: "Nepal",
        flag: "https://flagcdn.com/np.svg",
        independent: false,
      },
      {
        name: "Netherlands",
        flag: "https://flagcdn.com/nl.svg",
        independent: false,
      },
      {
        name: "New Caledonia",
        flag: "https://flagcdn.com/nc.svg",
        independent: false,
      },
      {
        name: "New Zealand",
        flag: "https://flagcdn.com/nz.svg",
        independent: false,
      },
      {
        name: "Nicaragua",
        flag: "https://flagcdn.com/ni.svg",
        independent: false,
      },
      {
        name: "Niger",
        flag: "https://flagcdn.com/ne.svg",
        independent: false,
      },
      {
        name: "Nigeria",
        flag: "https://flagcdn.com/ng.svg",
        independent: false,
      },
      {
        name: "Niue",
        flag: "https://flagcdn.com/nu.svg",
        independent: false,
      },
      {
        name: "Norfolk Island",
        flag: "https://flagcdn.com/nf.svg",
        independent: false,
      },
      {
        name: "Korea (Democratic People's Republic of)",
        flag: "https://flagcdn.com/kp.svg",
        independent: false,
      },
      {
        name: "Northern Mariana Islands",
        flag: "https://flagcdn.com/mp.svg",
        independent: false,
      },
      {
        name: "Norway",
        flag: "https://flagcdn.com/no.svg",
        independent: false,
      },
      {
        name: "Oman",
        flag: "https://flagcdn.com/om.svg",
        independent: false,
      },
      {
        name: "Pakistan",
        flag: "https://flagcdn.com/pk.svg",
        independent: false,
      },
      {
        name: "Palau",
        flag: "https://flagcdn.com/pw.svg",
        independent: false,
      },
      {
        name: "Palestine, State of",
        flag: "https://flagcdn.com/ps.svg",
        independent: false,
      },
      {
        name: "Panama",
        flag: "https://flagcdn.com/pa.svg",
        independent: false,
      },
      {
        name: "Papua New Guinea",
        flag: "https://flagcdn.com/pg.svg",
        independent: false,
      },
      {
        name: "Paraguay",
        flag: "https://flagcdn.com/py.svg",
        independent: false,
      },
      {
        name: "Peru",
        flag: "https://flagcdn.com/pe.svg",
        independent: false,
      },
      {
        name: "Philippines",
        flag: "https://flagcdn.com/ph.svg",
        independent: false,
      },
      {
        name: "Pitcairn",
        flag: "https://flagcdn.com/pn.svg",
        independent: false,
      },
      {
        name: "Poland",
        flag: "https://flagcdn.com/pl.svg",
        independent: false,
      },
      {
        name: "Portugal",
        flag: "https://flagcdn.com/pt.svg",
        independent: false,
      },
      {
        name: "Puerto Rico",
        flag: "https://flagcdn.com/pr.svg",
        independent: false,
      },
      {
        name: "Qatar",
        flag: "https://flagcdn.com/qa.svg",
        independent: false,
      },
      {
        name: "Republic of Kosovo",
        flag: "https://flagcdn.com/xk.svg",
        independent: false,
      },
      {
        name: "Réunion",
        flag: "https://flagcdn.com/re.svg",
        independent: false,
      },
      {
        name: "Romania",
        flag: "https://flagcdn.com/ro.svg",
        independent: false,
      },
      {
        name: "Russian Federation",
        flag: "https://flagcdn.com/ru.svg",
        independent: false,
      },
      {
        name: "Rwanda",
        flag: "https://flagcdn.com/rw.svg",
        independent: false,
      },
      {
        name: "Saint Barthélemy",
        flag: "https://flagcdn.com/bl.svg",
        independent: false,
      },
      {
        name: "Saint Helena, Ascension and Tristan da Cunha",
        flag: "https://flagcdn.com/sh.svg",
        independent: false,
      },
      {
        name: "Saint Kitts and Nevis",
        flag: "https://flagcdn.com/kn.svg",
        independent: false,
      },
      {
        name: "Saint Lucia",
        flag: "https://flagcdn.com/lc.svg",
        independent: false,
      },
      {
        name: "Saint Martin (French part)",
        flag: "https://flagcdn.com/mf.svg",
        independent: false,
      },
      {
        name: "Saint Pierre and Miquelon",
        flag: "https://flagcdn.com/pm.svg",
        independent: false,
      },
      {
        name: "Saint Vincent and the Grenadines",
        flag: "https://flagcdn.com/vc.svg",
        independent: false,
      },
      {
        name: "Samoa",
        flag: "https://flagcdn.com/ws.svg",
        independent: false,
      },
      {
        name: "San Marino",
        flag: "https://flagcdn.com/sm.svg",
        independent: false,
      },
      {
        name: "Sao Tome and Principe",
        flag: "https://flagcdn.com/st.svg",
        independent: false,
      },
      {
        name: "Saudi Arabia",
        flag: "https://flagcdn.com/sa.svg",
        independent: false,
      },
      {
        name: "Senegal",
        flag: "https://flagcdn.com/sn.svg",
        independent: false,
      },
      {
        name: "Serbia",
        flag: "https://flagcdn.com/rs.svg",
        independent: false,
      },
      {
        name: "Seychelles",
        flag: "https://flagcdn.com/sc.svg",
        independent: false,
      },
      {
        name: "Sierra Leone",
        flag: "https://flagcdn.com/sl.svg",
        independent: false,
      },
      {
        name: "Singapore",
        flag: "https://flagcdn.com/sg.svg",
        independent: false,
      },
      {
        name: "Sint Maarten (Dutch part)",
        flag: "https://flagcdn.com/sx.svg",
        independent: false,
      },
      {
        name: "Slovakia",
        flag: "https://flagcdn.com/sk.svg",
        independent: false,
      },
      {
        name: "Slovenia",
        flag: "https://flagcdn.com/si.svg",
        independent: false,
      },
      {
        name: "Solomon Islands",
        flag: "https://flagcdn.com/sb.svg",
        independent: false,
      },
      {
        name: "Somalia",
        flag: "https://flagcdn.com/so.svg",
        independent: false,
      },
      {
        name: "South Africa",
        flag: "https://flagcdn.com/za.svg",
        independent: false,
      },
      {
        name: "South Georgia and the South Sandwich Islands",
        flag: "https://flagcdn.com/gs.svg",
        independent: false,
      },
      {
        name: "Korea (Republic of)",
        flag: "https://flagcdn.com/kr.svg",
        independent: false,
      },
      {
        name: "Spain",
        flag: "https://flagcdn.com/es.svg",
        independent: false,
      },
      {
        name: "Sri Lanka",
        flag: "https://flagcdn.com/lk.svg",
        independent: false,
      },
      {
        name: "Sudan",
        flag: "https://flagcdn.com/sd.svg",
        independent: false,
      },
      {
        name: "South Sudan",
        flag: "https://flagcdn.com/ss.svg",
        independent: false,
      },
      {
        name: "Suriname",
        flag: "https://flagcdn.com/sr.svg",
        independent: false,
      },
      {
        name: "Svalbard and Jan Mayen",
        flag: "https://flagcdn.com/sj.svg",
        independent: false,
      },
      {
        name: "Swaziland",
        flag: "https://flagcdn.com/sz.svg",
        independent: false,
      },
      {
        name: "Sweden",
        flag: "https://flagcdn.com/se.svg",
        independent: false,
      },
      {
        name: "Switzerland",
        flag: "https://flagcdn.com/ch.svg",
        independent: false,
      },
      {
        name: "Syrian Arab Republic",
        flag: "https://flagcdn.com/sy.svg",
        independent: false,
      },
      {
        name: "Taiwan",
        flag: "https://flagcdn.com/tw.svg",
        independent: false,
      },
      {
        name: "Tajikistan",
        flag: "https://flagcdn.com/tj.svg",
        independent: false,
      },
      {
        name: "Tanzania, United Republic of",
        flag: "https://flagcdn.com/tz.svg",
        independent: false,
      },
      {
        name: "Thailand",
        flag: "https://flagcdn.com/th.svg",
        independent: false,
      },
      {
        name: "Timor-Leste",
        flag: "https://flagcdn.com/tl.svg",
        independent: false,
      },
      {
        name: "Togo",
        flag: "https://flagcdn.com/tg.svg",
        independent: false,
      },
      {
        name: "Tokelau",
        flag: "https://flagcdn.com/tk.svg",
        independent: false,
      },
      {
        name: "Tonga",
        flag: "https://flagcdn.com/to.svg",
        independent: false,
      },
      {
        name: "Trinidad and Tobago",
        flag: "https://flagcdn.com/tt.svg",
        independent: false,
      },
      {
        name: "Tunisia",
        flag: "https://flagcdn.com/tn.svg",
        independent: false,
      },
      {
        name: "Turkey",
        flag: "https://flagcdn.com/tr.svg",
        independent: false,
      },
      {
        name: "Turkmenistan",
        flag: "https://flagcdn.com/tm.svg",
        independent: false,
      },
      {
        name: "Turks and Caicos Islands",
        flag: "https://flagcdn.com/tc.svg",
        independent: false,
      },
      {
        name: "Tuvalu",
        flag: "https://flagcdn.com/tv.svg",
        independent: false,
      },
      {
        name: "Uganda",
        flag: "https://flagcdn.com/ug.svg",
        independent: false,
      },
      {
        name: "Ukraine",
        flag: "https://flagcdn.com/ua.svg",
        independent: false,
      },
      {
        name: "United Arab Emirates",
        flag: "https://flagcdn.com/ae.svg",
        independent: false,
      },
      {
        name: "United Kingdom of Great Britain and Northern Ireland",
        flag: "https://flagcdn.com/gb.svg",
        independent: false,
      },
      {
        name: "United States of America",
        flag: "https://flagcdn.com/us.svg",
        independent: false,
      },
      {
        name: "Uruguay",
        flag: "https://flagcdn.com/uy.svg",
        independent: false,
      },
      {
        name: "Uzbekistan",
        flag: "https://flagcdn.com/uz.svg",
        independent: false,
      },
      {
        name: "Vanuatu",
        flag: "https://flagcdn.com/vu.svg",
        independent: false,
      },
      {
        name: "Venezuela (Bolivarian Republic of)",
        flag: "https://flagcdn.com/ve.svg",
        independent: false,
      },
      {
        name: "Vietnam",
        flag: "https://flagcdn.com/vn.svg",
        independent: false,
      },
      {
        name: "Wallis and Futuna",
        flag: "https://flagcdn.com/wf.svg",
        independent: false,
      },
      {
        name: "Western Sahara",
        flag: "https://flagcdn.com/eh.svg",
        independent: false,
      },
      {
        name: "Yemen",
        flag: "https://flagcdn.com/ye.svg",
        independent: false,
      },
      {
        name: "Zambia",
        flag: "https://flagcdn.com/zm.svg",
        independent: false,
      },
      {
        name: "Zimbabwe",
        flag: "https://flagcdn.com/zw.svg",
        independent: false,
      },
    ];

    return countries;
  } catch (err) {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE
export async function createGuest(newGuest: NewGuestParams) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking: { [key: string]: string }) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

/*
// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(
  id: string,
  updatedFields: { [key: string]: string }
) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(
  id: string,
  updatedFields: { [key: string]: string }
) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: string) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
*/
