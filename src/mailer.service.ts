import { Resend } from 'resend';


export class mailerService {
    private readonly mailer: Resend;
    constructor() {
        this.mailer=new Resend(process.env.RESEND_API_KEY);
    }
    async sendCreatedAccountEmail({recipient,firstName}:{recipient:string,firstName:string}){
        const { data, error } = await this.mailer.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [recipient],
            subject: 'Bienvenue sur la plateforme',
            html: `Bonjour ${firstName}, et bienvenue dans notre plateforme nous sommes<strong>heureux!</strong> de vous avoir parmi nous.   `,
          });
        
          if (error) {
            return console.error({ error });
          }
        
          console.log({ data });
    }
    async sendRequestedPasswordEmail({recipient,firstName,token}:{recipient:string,firstName:string,token:string}){
        const link=`${process.env.ClIENTURl}/reset-password?token=${token}`;
        const { data, error } = await this.mailer.emails.send({
            from: 'Securite Alimentaire <onboarding@resend.dev>',
            to: [recipient],
            subject: 'Réinitialisation de votre mot de passe',
            html: `
              <div style="font-family: Arial, sans-serif;">
                <img src="https://example.com/logo.png" alt="Logo de Securite Alimentaire" style="max-width: 200px;">
                <h2>Bonjour ${firstName},</h2>
                <p>Vous avez demandé une réinitialisation de votre mot de passe sur Securite Alimentaire.</p>
                <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
                <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
                <p>Merci,<br>L'équipe Securite Alimentaire</p>
              </div>
            `})
          
        
          if (error) {
            return console.error({ error });
          }
        
          console.log({ data });
    }
}
