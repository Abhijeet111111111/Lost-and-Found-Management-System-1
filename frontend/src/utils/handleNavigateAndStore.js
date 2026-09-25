export default function handleNavigateAndStore(
  navigate,
  to,
  prevLink,
  isLoggedIn,
) {
  const prevPageLink = localStorage.getItem(prevLink);
  if (!prevPageLink && !isLoggedIn) {
    localStorage.setItem("prevPageLink", prevLink);
  }
  navigate(to);
}
