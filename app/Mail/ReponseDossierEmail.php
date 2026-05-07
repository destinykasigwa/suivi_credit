<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReponseDossierEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user = "";
    public $data = "";
    public $userName="";

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data,$userName)
    {

        $this->data = $data;
         $this->userName = $userName;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Transactions Email',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'emails.reponse-dossier',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }

    public function build()
    {
        return $this
            ->from('info@coopecakibayetu.org')
            ->subject('AKIBA YETU')
            ->view('emails.reponse-dossier');
    }
}
