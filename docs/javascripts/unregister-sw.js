// Unregister any old service workers (e.g. from previous Blinko instance)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let reg of registrations) {
      reg.unregister();
    }
  });
}
