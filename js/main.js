document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          var otherBtn = other.querySelector('.faq-q');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Posts a waitlist form's data as JSON directly to PriviHub-api, instead
  // of Formspree. endpointPath is appended to API_BASE_URL; buildPayload
  // turns the form's FormData into the exact JSON body that endpoint
  // expects.
  // Placeholder — point this at the real PriviHub API once it's deployed.
  // Local dev: http://localhost:3000. See PriviHub-api's own README for how
  // it's run/deployed.
  var API_BASE_URL = 'https://api.privihub.app';

  function initApiWaitlistForm(form, endpointPath, buildPayload) {
    var section = form.closest('section') || form.parentElement;
    var status = section ? section.querySelector('[data-waitlist-status]') : null;
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining…';
      }
      if (status) {
        status.textContent = '';
        status.classList.remove('error');
      }

      fetch(API_BASE_URL + endpointPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(new FormData(form))),
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (status) status.textContent = "You're on the list — we'll email you at launch.";
            return;
          }
          return response.json().then(function (data) {
            // NestJS's ValidationPipe returns { message: string | string[] },
            // not Formspree's { errors: [...] } shape this site used to post to.
            var message =
              data && data.message
                ? Array.isArray(data.message) ? data.message.join(', ') : data.message
                : 'Something went wrong — please try again.';
            throw new Error(message);
          });
        })
        .catch(function (err) {
          if (status) {
            status.textContent = (err && err.message) || "Couldn't join right now — please try again.";
            status.classList.add('error');
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
        });
    });
  }

  document.querySelectorAll('[data-waitlist-form="api"]').forEach(function (form) {
    initApiWaitlistForm(form, '/waitlist', function (fd) {
      return {
        name: fd.get('name'),
        mobileNumber: fd.get('mobileNumber'),
        suburb: fd.get('suburb'),
        source: 'website',
      };
    });
  });

  document.querySelectorAll('[data-waitlist-form="api-customer"]').forEach(function (form) {
    initApiWaitlistForm(form, '/customer-waitlist', function (fd) {
      return { email: fd.get('email') };
    });
  });
});
