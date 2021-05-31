<?php

namespace App\Catrobat\Listeners;

use Exception;
use Gesdinet\JWTRefreshTokenBundle\EventListener\AttachRefreshTokenOnSuccessListener;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;

class JWTAuthenticationSuccessListener
{
  private int $jwtTokenLifetime;

  private int $refreshTokenLifetime;

  private AttachRefreshTokenOnSuccessListener $listener;

  public function __construct(int $jwtTokenLifetime, int $refreshTokenLifetime,
                                AttachRefreshTokenOnSuccessListener $listener)
  {
    $this->jwtTokenLifetime = $jwtTokenLifetime;
    $this->refreshTokenLifetime = $refreshTokenLifetime;
    $this->listener = $listener;
  }

  /**
   * Sets JWT as a cookie on successful authentication.
   *
   * @throws Exception
   */
  public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
  {
    $this->listener->attachRefreshToken($event);
    $event->getResponse()->headers->setCookie(
            new Cookie(
                'REFRESH_TOKEN',
                $event->getData()['refresh_token'],
                time() + $this->refreshTokenLifetime, // expiration
                '/api/authentication', // path
                null, // domain, null means that Symfony will generate it on its own.
                true, // secure
                true, // httpOnly
                false, // raw
                'strict' // same-site parameter, can be 'lax' or 'strict'.
            )
        );
    $event->getResponse()->headers->setCookie(
            new Cookie(
                'BEARER',
                $event->getData()['token'],
                time() + $this->jwtTokenLifetime, // expiration
                '/', // path
                null, // domain, null means that Symfony will generate it on its own.
                true, // secure
                false, // httpOnly
                false, // raw
                'lax' // same-site parameter, can be 'lax' or 'strict'.
            )
        );
  }
}
