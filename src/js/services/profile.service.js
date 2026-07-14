window.ProfileService = (function () {
  const profiles = [
    {
      id: "claudio",
      name: "Claudio",
      abbreviation: "CL",
      level: 5,
      xp: 1250,
      streak: 7,
      colorClass: "bg-claudio",
    },
    {
      id: "caique",
      name: "Caique",
      abbreviation: "CA",
      level: 4,
      xp: 980,
      streak: 5,
      colorClass: "bg-caique",
    },
  ];

  function getProfiles() {
    return profiles;
  }

  function getProfileById(id) {
    return profiles.find((profile) => profile.id === id) || null;
  }

  return {
    getProfiles,
    getProfileById,
  };
})();