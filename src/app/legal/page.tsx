import { ShieldAlert, Scale, FileText } from 'lucide-react';

export default function LegalPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-16">
                <div className="bg-secondary/50 p-4 rounded-full w-fit mx-auto text-muted-foreground mb-6">
                    <Scale size={40} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-breakfast-coffee mb-4 uppercase">LEGAL INFORMATION</h1>
                <p className="text-muted-foreground font-medium italic">Transparency for the Breakfast Sandwich Community</p>
            </div>

            <div className="glassmorphism p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-xl space-y-12">
                <section className="space-y-6">
                    <div className="flex items-center gap-4 text-breakfast-coffee">
                        <ShieldAlert className="text-primary" size={24} />
                        <h2 className="text-xl font-black uppercase tracking-tight">No Warranty Disclaimer</h2>
                    </div>
                    <div className="bg-destructive/5 border border-destructive/10 p-8 rounded-3xl">
                        <p className="text-sm font-bold text-destructive uppercase tracking-widest mb-4">Read carefully</p>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            BREKKYSAMMY IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                            INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                            PARTICULAR PURPOSE AND NONINFRINGEMENT.
                        </p>
                        <p className="text-muted-foreground font-medium leading-relaxed mt-4">
                            IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
                            OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                            FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-4 text-breakfast-coffee">
                        <FileText className="text-primary" size={24} />
                        <h2 className="text-xl font-black uppercase tracking-tight">Terms of Use</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h3 className="text-sm font-black text-breakfast-coffee/70 uppercase">Content Accuracy</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Users are responsible for the accuracy of their submissions. Reviews and ratings
                                represent personal opinions and subjective experiences.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-sm font-black text-breakfast-coffee/70 uppercase">Modifications</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                We reserve the right to modify or remove content that violates community standards
                                or contains inappropriate material.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="pt-8 border-t border-border/10">
                    <p className="text-center text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground/30">
                        For inquiries, visit <a href="https://idrumgood.com" className="text-primary hover:underline">idrumgood.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
