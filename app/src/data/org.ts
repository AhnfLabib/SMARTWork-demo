import type { OrgNode } from "../types/org";

export const ORG_TREE: OrgNode = {
  name: "Mike Simmons",
  title: "CEO & Founder",
  type: "executive",
  profileId: "mike-simmons",
  children: [
    {
      name: "John Brandon",
      title: "VP of Nonprofit Sector",
      type: "executive",
      profileId: "john-brandon"
    },
    {
      name: "Jack Dougher",
      title: "Director of Workforce Development",
      type: "director",
      profileId: "jack-dougher",
      children: [
        {
          name: "Derek Miller",
          title: "Project Manager",
          type: "manager",
          profileId: "derek-miller",
          children: [
            {
              name: "Brady Trebley",
              title: "Research and Business Development Intern",
              type: "intern",
              profileId: "brady-trebley"
            }
          ]
        },
        {
          name: "Nick Schramm",
          title: "Project Manager",
          type: "manager",
          profileId: "nick-schramm",
          children: [
            {
              name: "Ahnaf Labib",
              title: "Project Manager",
              type: "manager",
              profileId: "ahnaf-labib"
            },
            {
              name: "Austin Cooper",
              title: "Marketing and Business Development Intern",
              type: "intern",
              profileId: "austin-cooper"
            },
            {
              name: "Tapan Mandal",
              title: "Data and Strategy Intern",
              type: "intern",
              profileId: "tapan-mandal"
            }
          ]
        }
      ]
    },
    {
      name: "Hoyt Stafford",
      title: "Director of Project Management",
      type: "director",
      profileId: "hoyt-stafford",
      children: [
        {
          name: "Owen Nguyen",
          title: "Financial Analysis & Product Strategy Intern",
          type: "intern",
          profileId: "owen-nguyen"
        },
        {
          name: "Keagan Combs",
          title: "Research Intern",
          type: "intern",
          profileId: "keagan-combs"
        }
      ]
    },
    {
      name: "Gary Raikes",
      title: "Senior Vice President, Business Development & Growth Strategy",
      type: "executive",
      profileId: "gary-raikes",
      children: [
        {
          name: "Adelai Elsener",
          title: "Marketing and Sales Operations Coordinator",
          type: "manager",
          profileId: "adelai-elsener"
        }
      ]
    },
    {
      name: "Chelsea Neulieb",
      title: "Consultant",
      type: "consultant",
      profileId: "chelsea-neulieb"
    },
    {
      name: "Bryan Alig",
      title: "Director of Work-Based Learning",
      type: "director",
      profileId: "bryan-alig"
    },
    {
      name: "Eric Kilbride",
      title: "Part-Time Business Development Advisor",
      type: "consultant",
      profileId: "eric-kilbride"
    },
    {
      name: "Ben Neumann",
      title: "Director, Southeast U.S. Business Development",
      type: "consultant",
      profileId: "ben-neumann"
    }
  ]
};
